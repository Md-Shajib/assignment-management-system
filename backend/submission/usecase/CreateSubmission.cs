using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Shared.Utilities;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Student.UseCases;
using AssignmentManagement.Submission.Repositories;
using AssignmentManagement.Submission.Dtos;

namespace AssignmentManagement.Submission.UseCases;

/// <summary>
/// Creates a student submission for an assignment. Each student has only one active
/// submission per assignment, so an existing submission is overwritten.
/// Submissions are allowed while the assignment is published and the deadline (or, when
/// enabled, the late-submission window) has not passed; late submissions are marked as late.
/// </summary>
public class CreateSubmission
{
    private readonly ISubmissionRepository _repository;
    private readonly GetAssignment _getAssignment;
    private readonly GetStudent _getStudent;

    public CreateSubmission(ISubmissionRepository repository, GetAssignment getAssignment, GetStudent getStudent)
    {
        _repository = repository;
        _getAssignment = getAssignment;
        _getStudent = getStudent;
    }

    public async Task<Domain.Submission> ExecuteAsync(SubmitRequest request, Guid userId, CancellationToken cancellationToken = default)
    {
        var assignment = await _getAssignment.ByIdAsync(request.AssignmentId, cancellationToken);

        if (assignment.Status != AssignmentStatus.Published)
        {
            throw new BusinessRuleException(
                "Only published assignments can accept submissions.",
                StatusCodes.Status409Conflict);
        }

        var student = await _getStudent.ByUserIdAsync(userId, cancellationToken);

        if (!student.CourseId.HasValue || assignment.CourseId != student.CourseId.Value)
        {
            throw new BusinessRuleException(
                "You can only submit to assignments of the course you are enrolled in.",
                StatusCodes.Status403Forbidden);
        }

        var (allowed, isLate) = SubmissionTiming.Evaluate(DateTime.UtcNow, assignment.Deadline, assignment.LateSubmissionEndDate);
        if (!allowed)
        {
            throw new BusinessRuleException(
                "The submission window is closed.",
                StatusCodes.Status409Conflict);
        }

        var status = isLate ? SubmissionStatus.LateSubmitted : SubmissionStatus.Submitted;

        var existing = await _repository.GetByAssignmentAndStudentAsync(assignment.Id, student.Id, cancellationToken);
        if (existing is null)
        {
            var submission = new Domain.Submission
            {
                AssignmentId = assignment.Id,
                StudentId = student.Id,
                SubmissionText = request.SubmissionText,
                Attachment = request.Attachment,
                Status = status
            };

            await _repository.AddAsync(submission, cancellationToken);
            return submission;
        }

        existing.SubmissionText = request.SubmissionText;
        existing.Attachment = request.Attachment;
        existing.Status = status;
        existing.ObtainedMarks = null;
        existing.TeacherFeedback = null;
        existing.ReviewedAt = null;
        existing.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(existing, cancellationToken);
        return existing;
    }
}