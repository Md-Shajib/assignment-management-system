using Xunit;
using Moq;
using FluentAssertions;
using AssignmentManagement.Domain;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Submission.Dtos;
using AssignmentManagement.Submission.Repositories;
using AssignmentManagement.Submission.UseCases;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using Microsoft.AspNetCore.Http;

namespace AssignmentManagement.Tests.Unit.Submission;

public class GradeSubmissionTests
{
    private readonly Mock<ISubmissionRepository> _submissionRepository = new();
    private readonly Mock<IAssignmentRepository> _assignmentRepository = new();

    private GradeSubmission CreateSut()
        => new(_submissionRepository.Object, new GetAssignment(_assignmentRepository.Object));

    private static Domain.Submission Submission()
        => new()
        {
            Id = Guid.NewGuid(),
            AssignmentId = Guid.NewGuid(),
            StudentId = Guid.NewGuid(),
            SubmissionText = "answer",
            Status = SubmissionStatus.Submitted
        };

    private static Domain.Assignment AssignmentOf(Domain.Submission submission, Guid teacherId, decimal maxMarks = 100)
        => new()
        {
            Id = submission.AssignmentId,
            TeacherId = teacherId,
            Title = "Quiz",
            Status = AssignmentStatus.Published,
            Deadline = DateTime.UtcNow.AddDays(3),
            MaxMarks = maxMarks
        };

    [Fact]
    public async Task ExecuteAsync_ByNonOwningTeacher_ThrowsForbidden()
    {
        var submission = Submission();
        var assignment = AssignmentOf(submission, Guid.NewGuid());
        _submissionRepository.Setup(r => r.GetByIdAsync(submission.Id, It.IsAny<CancellationToken>())).ReturnsAsync(submission);
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var act = () => CreateSut().ExecuteAsync(
            submission.Id, new GradeSubmissionRequest { ObtainedMarks = 80 }, Guid.NewGuid(), false, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status403Forbidden);
    }

    [Fact]
    public async Task ExecuteAsync_MarksExceedMaximum_ThrowsConflict()
    {
        var teacherId = Guid.NewGuid();
        var submission = Submission();
        var assignment = AssignmentOf(submission, teacherId, maxMarks: 100);
        _submissionRepository.Setup(r => r.GetByIdAsync(submission.Id, It.IsAny<CancellationToken>())).ReturnsAsync(submission);
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var act = () => CreateSut().ExecuteAsync(
            submission.Id, new GradeSubmissionRequest { ObtainedMarks = 101 }, teacherId, false, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status409Conflict);
    }

    [Fact]
    public async Task ExecuteAsync_AsOwningTeacher_GradesAndAllowsReGrade()
    {
        var teacherId = Guid.NewGuid();
        var submission = Submission();
        var assignment = AssignmentOf(submission, teacherId);
        _submissionRepository.Setup(r => r.GetByIdAsync(submission.Id, It.IsAny<CancellationToken>())).ReturnsAsync(submission);
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var graded = await CreateSut().ExecuteAsync(
            submission.Id, new GradeSubmissionRequest { ObtainedMarks = 88.5m, TeacherFeedback = "Good" }, teacherId, false, CancellationToken.None);

        graded.Status.Should().Be(SubmissionStatus.Graded);
        graded.ObtainedMarks.Should().Be(88.5m);
        graded.ReviewedAt.Should().NotBeNull();
        _submissionRepository.Verify(r => r.UpdateAsync(submission, It.IsAny<CancellationToken>()), Times.Once);

        var reGraded = await CreateSut().ExecuteAsync(
            submission.Id, new GradeSubmissionRequest { ObtainedMarks = 90m }, teacherId, false, CancellationToken.None);

        reGraded.ObtainedMarks.Should().Be(90m);
        _submissionRepository.Verify(r => r.UpdateAsync(submission, It.IsAny<CancellationToken>()), Times.Exactly(2));
    }

    [Fact]
    public async Task ExecuteAsync_AdminBypassesOwnership()
    {
        var submission = Submission();
        var assignment = AssignmentOf(submission, Guid.NewGuid());
        _submissionRepository.Setup(r => r.GetByIdAsync(submission.Id, It.IsAny<CancellationToken>())).ReturnsAsync(submission);
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);

        var graded = await CreateSut().ExecuteAsync(
            submission.Id, new GradeSubmissionRequest { ObtainedMarks = 75m }, Guid.NewGuid(), true, CancellationToken.None);

        graded.Status.Should().Be(SubmissionStatus.Graded);
    }
}