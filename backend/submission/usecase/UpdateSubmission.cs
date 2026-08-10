using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Shared.Utilities;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Student.UseCases;
using AssignmentManagement.Submission.Repositories;
using AssignmentManagement.Submission.Dtos;

namespace AssignmentManagement.Submission.UseCases;

/// <summary>
/// Updates a student's own submission. Updates are allowed while the assignment is
/// published and the deadline (or late-submission window) has not passed; the latest
/// version overwrites the previous one.
/// </summary>
public class UpdateSubmission
{
    private readonly ISubmissionRepository _repository;
    private readonly GetAssignment _getAssignment;
    private readonly GetStudent _getStudent;

    public UpdateSubmission(ISubmissionRepository repository, GetAssignment getAssignment, GetStudent getStudent)
    {
        _repository = repository;
        _getAssignment = getAssignment;
        _getStudent = getStudent;
    }

    public async Task<Domain.Submission> ExecuteAsync(Guid id, SubmitRequest request, Guid userId, CancellationToken cancellationToken = default)
    {
        var submission = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Submission '{id}' was not found.");

        var student = await _getStudent.ByUserIdAsync(userId, cancellationToken);

        if (submission.StudentId != student.Id)
        {
            throw new BusinessRuleException(
                "You can only update your own submission.",
                StatusCodes.Status403Forbidden);
        }

        var assignment = await _getAssignment.ByIdAsync(submission.AssignmentId, cancellationToken);

        if (assignment.Status != AssignmentStatus.Published)
        {
            throw new BusinessRuleException(
                "Only published assignments can accept submissions.",
                StatusCodes.Status409Conflict);
        }

        var (allowed, isLate) = SubmissionTiming.Evaluate(DateTime.UtcNow, assignment.Deadline, assignment.LateSubmissionEndDate);
        if (!allowed)
        {
            throw new BusinessRuleException(
                "The submission window is closed.",
                StatusCodes.Status409Conflict);
        }

        submission.SubmissionText = request.SubmissionText;
        submission.Attachment = request.Attachment;
        submission.Status = isLate ? SubmissionStatus.LateSubmitted : SubmissionStatus.Submitted;
        submission.ObtainedMarks = null;
        submission.TeacherFeedback = null;
        submission.ReviewedAt = null;
        submission.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(submission, cancellationToken);
        return submission;
    }
}