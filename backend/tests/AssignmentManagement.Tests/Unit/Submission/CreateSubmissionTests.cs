using Xunit;
using Moq;
using FluentAssertions;
using AssignmentManagement.Domain;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Student.Repositories;
using AssignmentManagement.Student.UseCases;
using AssignmentManagement.Submission.Dtos;
using AssignmentManagement.Submission.Repositories;
using AssignmentManagement.Submission.UseCases;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using Microsoft.AspNetCore.Http;

namespace AssignmentManagement.Tests.Unit.Submission;

public class CreateSubmissionTests
{
    private readonly Mock<ISubmissionRepository> _submissionRepository = new();
    private readonly Mock<IAssignmentRepository> _assignmentRepository = new();
    private readonly Mock<IStudentRepository> _studentRepository = new();

    private CreateSubmission CreateSut()
        => new(
            _submissionRepository.Object,
            new GetAssignment(_assignmentRepository.Object),
            new GetStudent(_studentRepository.Object));

    private static Domain.Assignment PublishedAssignment(Guid courseId, DateTime deadline, DateTime? lateEnd)
        => new()
        {
            Id = Guid.NewGuid(),
            CourseId = courseId,
            TeacherId = Guid.NewGuid(),
            Title = "Quiz",
            Status = AssignmentStatus.Published,
            Deadline = deadline,
            LateSubmissionEndDate = lateEnd
        };

    private static Domain.Student EnrolledStudent(Guid? courseId)
        => new()
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            CourseId = courseId,
            FullName = "Test Student",
            Email = "student@school.com"
        };

    [Theory]
    [InlineData(AssignmentStatus.Draft)]
    [InlineData(AssignmentStatus.Closed)]
    public async Task ExecuteAsync_AssignmentNotPublished_ThrowsConflict(string status)
    {
        var student = EnrolledStudent(Guid.NewGuid());
        var assignment = PublishedAssignment(Guid.NewGuid(), DateTime.UtcNow.AddDays(7), null);
        assignment.Status = status;
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);
        _studentRepository.Setup(r => r.GetByUserIdAsync(student.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(student);

        var act = () => CreateSut().ExecuteAsync(
            new SubmitRequest { AssignmentId = assignment.Id, SubmissionText = "answer" }, student.UserId, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status409Conflict);
    }

    [Fact]
    public async Task ExecuteAsync_NotEnrolledInCourse_ThrowsForbidden()
    {
        var student = EnrolledStudent(null);
        var assignment = PublishedAssignment(Guid.NewGuid(), DateTime.UtcNow.AddDays(7), null);
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);
        _studentRepository.Setup(r => r.GetByUserIdAsync(student.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(student);

        var act = () => CreateSut().ExecuteAsync(
            new SubmitRequest { AssignmentId = assignment.Id, SubmissionText = "answer" }, student.UserId, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status403Forbidden);
    }

    [Fact]
    public async Task ExecuteAsync_BeforeDeadline_SubmitsOnTime()
    {
        var courseId = Guid.NewGuid();
        var student = EnrolledStudent(courseId);
        var assignment = PublishedAssignment(courseId, DateTime.UtcNow.AddDays(7), null);
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);
        _studentRepository.Setup(r => r.GetByUserIdAsync(student.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(student);

        var submission = await CreateSut().ExecuteAsync(
            new SubmitRequest { AssignmentId = assignment.Id, SubmissionText = "answer" }, student.UserId, CancellationToken.None);

        submission.Status.Should().Be(SubmissionStatus.Submitted);
        _submissionRepository.Verify(r => r.AddAsync(submission, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_AfterDeadlineWithinLateWindow_MarksLateSubmitted()
    {
        var courseId = Guid.NewGuid();
        var student = EnrolledStudent(courseId);
        var assignment = PublishedAssignment(courseId, DateTime.UtcNow.AddDays(-1), DateTime.UtcNow.AddDays(1));
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);
        _studentRepository.Setup(r => r.GetByUserIdAsync(student.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(student);

        var submission = await CreateSut().ExecuteAsync(
            new SubmitRequest { AssignmentId = assignment.Id, SubmissionText = "late" }, student.UserId, CancellationToken.None);

        submission.Status.Should().Be(SubmissionStatus.LateSubmitted);
    }

    [Fact]
    public async Task ExecuteAsync_AfterLateWindowClosed_ThrowsConflict()
    {
        var courseId = Guid.NewGuid();
        var student = EnrolledStudent(courseId);
        var assignment = PublishedAssignment(courseId, DateTime.UtcNow.AddDays(-3), DateTime.UtcNow.AddDays(-1));
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);
        _studentRepository.Setup(r => r.GetByUserIdAsync(student.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(student);

        var act = () => CreateSut().ExecuteAsync(
            new SubmitRequest { AssignmentId = assignment.Id, SubmissionText = "too late" }, student.UserId, CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status409Conflict);
    }

    [Fact]
    public async Task ExecuteAsync_ExistingSubmission_IsOverwritten()
    {
        var courseId = Guid.NewGuid();
        var student = EnrolledStudent(courseId);
        var assignment = PublishedAssignment(courseId, DateTime.UtcNow.AddDays(7), null);
        var existing = new Domain.Submission { AssignmentId = assignment.Id, StudentId = student.Id, Status = SubmissionStatus.Submitted };
        _assignmentRepository.Setup(r => r.GetByIdAsync(assignment.Id, It.IsAny<CancellationToken>())).ReturnsAsync(assignment);
        _studentRepository.Setup(r => r.GetByUserIdAsync(student.UserId, It.IsAny<CancellationToken>())).ReturnsAsync(student);
        _submissionRepository.Setup(r => r.GetByAssignmentAndStudentAsync(assignment.Id, student.Id, It.IsAny<CancellationToken>())).ReturnsAsync(existing);

        var result = await CreateSut().ExecuteAsync(
            new SubmitRequest { AssignmentId = assignment.Id, SubmissionText = "revised" }, student.UserId, CancellationToken.None);

        result.Should().BeSameAs(existing);
        result.SubmissionText.Should().Be("revised");
        _submissionRepository.Verify(r => r.AddAsync(It.IsAny<Domain.Submission>(), It.IsAny<CancellationToken>()), Times.Never);
        _submissionRepository.Verify(r => r.UpdateAsync(existing, It.IsAny<CancellationToken>()), Times.Once);
    }
}