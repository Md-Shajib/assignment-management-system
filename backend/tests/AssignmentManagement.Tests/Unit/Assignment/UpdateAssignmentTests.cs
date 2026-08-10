using Xunit;
using Moq;
using FluentAssertions;
using AssignmentManagement.Domain;
using AssignmentManagement.Assignment.Dtos;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Shared.Exceptions;
using Microsoft.AspNetCore.Http;

namespace AssignmentManagement.Tests.Unit.Assignment;

public class UpdateAssignmentTests
{
    private readonly Mock<IAssignmentRepository> _repository = new();

    private UpdateAssignment CreateSut() => new(_repository.Object);

    private static Domain.Assignment OwnedAssignment(Guid teacherId, decimal maxMarks = 100)
        => new()
        {
            Id = Guid.NewGuid(),
            CourseId = Guid.NewGuid(),
            TeacherId = teacherId,
            Title = "Quiz",
            MaxMarks = maxMarks,
            Deadline = DateTime.UtcNow.AddDays(3)
        };

    [Fact]
    public async Task ExecuteAsync_ByNonOwner_ThrowsForbidden()
    {
        var assignment = OwnedAssignment(Guid.NewGuid());
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var act = () => CreateSut().ExecuteAsync(
            new UpdateAssignmentRequest { Id = assignment.Id }, Guid.NewGuid(), false, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status403Forbidden);
    }

    [Fact]
    public async Task ExecuteAsync_WhenMaxMarksChangedAndGradedSubmissionsExist_ThrowsConflict()
    {
        var teacherId = Guid.NewGuid();
        var assignment = OwnedAssignment(teacherId, maxMarks: 100);
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);
        _repository.Setup(r => r.HasGradedSubmissionsAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var act = () => CreateSut().ExecuteAsync(
            new UpdateAssignmentRequest { Id = assignment.Id, Title = "Quiz", MaxMarks = 200, Deadline = DateTime.UtcNow.AddDays(4) },
            teacherId, false, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status409Conflict);
    }

    [Fact]
    public async Task ExecuteAsync_WithDuplicateTitleExcludingSelf_ThrowsConflict()
    {
        var teacherId = Guid.NewGuid();
        var assignment = OwnedAssignment(teacherId);
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);
        _repository.Setup(r => r.ExistsByCourseAndTitleAsync(assignment.CourseId, "Duplicate", assignment.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var act = () => CreateSut().ExecuteAsync(
            new UpdateAssignmentRequest { Id = assignment.Id, Title = "Duplicate" }, teacherId, false, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status409Conflict);
    }

    [Fact]
    public async Task ExecuteAsync_AsOwner_Succeeds()
    {
        var teacherId = Guid.NewGuid();
        var assignment = OwnedAssignment(teacherId);
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);
        _repository.Setup(r => r.ExistsByCourseAndTitleAsync(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);
        _repository.Setup(r => r.HasGradedSubmissionsAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var request = new UpdateAssignmentRequest
        {
            Id = assignment.Id,
            Title = "Updated",
            Description = "New desc",
            MaxMarks = 100,
            Deadline = DateTime.UtcNow.AddDays(5)
        };

        var updated = await CreateSut().ExecuteAsync(request, teacherId, false, CancellationToken.None);

        updated.Title.Should().Be("Updated");
        _repository.Verify(r => r.UpdateAsync(assignment, It.IsAny<CancellationToken>()), Times.Once);
    }
}