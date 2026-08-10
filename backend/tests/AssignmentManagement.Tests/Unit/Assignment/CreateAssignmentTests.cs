using Xunit;
using Moq;
using FluentAssertions;
using AssignmentManagement.Domain;
using AssignmentManagement.Course.Repositories;
using AssignmentManagement.Assignment.Dtos;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.Transformers;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Shared.Constants;
using Microsoft.AspNetCore.Http;

namespace AssignmentManagement.Tests.Unit.Assignment;

public class CreateAssignmentTests
{
    private readonly Mock<IAssignmentRepository> _repository = new();
    private readonly Mock<ICourseRepository> _courseRepository = new();
    private readonly AssignmentRequestTransformer _transformer = new();

    private CreateAssignment CreateSut()
        => new(_repository.Object, _courseRepository.Object, _transformer);

    private static Domain.Course CourseWith(Guid? teacherId)
        => new() { Id = Guid.NewGuid(), Name = "Math", Code = "MATH101", TeacherId = teacherId };

    [Fact]
    public async Task ExecuteAsync_WithUnassignedTeacher_ThrowsForbidden()
    {
        var teacherId = Guid.NewGuid();
        _courseRepository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(CourseWith(Guid.NewGuid()));

        var act = () => CreateSut().ExecuteAsync(
            new CreateAssignmentRequest { CourseId = Guid.NewGuid() }, teacherId, false, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status403Forbidden);
    }

    [Fact]
    public async Task ExecuteAsync_WithDuplicateTitle_ThrowsConflict()
    {
        var teacherId = Guid.NewGuid();
        var course = CourseWith(teacherId);
        _courseRepository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(course);
        _repository.Setup(r => r.ExistsByCourseAndTitleAsync(course.Id, "Quiz", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var act = () => CreateSut().ExecuteAsync(
            new CreateAssignmentRequest { CourseId = course.Id, Title = "Quiz" }, teacherId, false, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status409Conflict);
    }

    [Fact]
    public async Task ExecuteAsync_WithMissingCourse_ThrowsNotFound()
    {
        _courseRepository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Domain.Course?)null);

        var act = () => CreateSut().ExecuteAsync(
            new CreateAssignmentRequest { CourseId = Guid.NewGuid() }, Guid.NewGuid(), false, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task ExecuteAsync_AsAssignedTeacher_CreatesDraftForCourseTeacher()
    {
        var teacherId = Guid.NewGuid();
        var course = CourseWith(teacherId);
        _courseRepository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(course);

        var assignment = await CreateSut().ExecuteAsync(
            new CreateAssignmentRequest { CourseId = course.Id, Title = "Quiz", Description = "Solve 1-5", MaxMarks = 20, Deadline = DateTime.UtcNow.AddDays(3) },
            teacherId, false, CancellationToken.None);

        assignment.Status.Should().Be(AssignmentStatus.Draft);
        assignment.TeacherId.Should().Be(teacherId);
        assignment.CourseId.Should().Be(course.Id);
    }
}