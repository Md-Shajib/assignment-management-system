using Xunit;
using Moq;
using FluentAssertions;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Domain;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using Microsoft.AspNetCore.Http;

namespace AssignmentManagement.Tests.Unit.Assignment;

public class PublishCloseTests
{
    private readonly Mock<IAssignmentRepository> _repository = new();

    private static Domain.Assignment Assignment(Guid teacherId, string status, DateTime? deadline = null)
        => new()
        {
            Id = Guid.NewGuid(),
            TeacherId = teacherId,
            Status = status,
            Deadline = deadline ?? DateTime.UtcNow.AddDays(3)
        };

    [Fact]
    public async Task Publish_FromDraftWithFutureDeadline_Publishes()
    {
        var teacherId = Guid.NewGuid();
        var assignment = Assignment(teacherId, AssignmentStatus.Draft);
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var published = await new PublishAssignment(_repository.Object).ExecuteAsync(assignment.Id, teacherId, false, CancellationToken.None);

        published.Status.Should().Be(AssignmentStatus.Published);
        _repository.Verify(r => r.UpdateAsync(assignment, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Publish_WithPastDeadline_Throws()
    {
        var teacherId = Guid.NewGuid();
        var assignment = Assignment(teacherId, AssignmentStatus.Draft, DateTime.UtcNow.AddDays(-1));
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var act = () => new PublishAssignment(_repository.Object).ExecuteAsync(assignment.Id, teacherId, false, CancellationToken.None);

        await act.Should().ThrowAsync<BusinessRuleException>();
    }

    [Fact]
    public async Task Publish_ByNonOwner_ThrowsForbidden()
    {
        var teacherId = Guid.NewGuid();
        var assignment = Assignment(Guid.NewGuid(), AssignmentStatus.Draft);
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var act = () => new PublishAssignment(_repository.Object).ExecuteAsync(assignment.Id, teacherId, false, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status403Forbidden);
    }

    [Fact]
    public async Task Publish_FromClosed_Throws()
    {
        var teacherId = Guid.NewGuid();
        var assignment = Assignment(teacherId, AssignmentStatus.Closed);
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var act = () => new PublishAssignment(_repository.Object).ExecuteAsync(assignment.Id, teacherId, false, CancellationToken.None);

        await act.Should().ThrowAsync<BusinessRuleException>();
    }

    [Fact]
    public async Task Close_FromPublished_Closes()
    {
        var teacherId = Guid.NewGuid();
        var assignment = Assignment(teacherId, AssignmentStatus.Published);
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var closed = await new CloseAssignment(_repository.Object).ExecuteAsync(assignment.Id, teacherId, false, CancellationToken.None);

        closed.Status.Should().Be(AssignmentStatus.Closed);
    }

    [Fact]
    public async Task Close_FromDraft_Throws()
    {
        var teacherId = Guid.NewGuid();
        var assignment = Assignment(teacherId, AssignmentStatus.Draft);
        _repository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var act = () => new CloseAssignment(_repository.Object).ExecuteAsync(assignment.Id, teacherId, false, CancellationToken.None);

        await act.Should().ThrowAsync<BusinessRuleException>();
    }
}