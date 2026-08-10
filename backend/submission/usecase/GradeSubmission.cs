using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Submission.Repositories;
using AssignmentManagement.Submission.Dtos;

namespace AssignmentManagement.Submission.UseCases;

/// <summary>
/// Grades a submission. Only the teacher who owns the assignment (or an Admin) can grade;
/// awarded marks cannot exceed the assignment's maximum marks. Re-grading is allowed and
/// transitions the submission to <see cref="SubmissionStatus.Graded"/>.
/// </summary>
public class GradeSubmission
{
    private readonly ISubmissionRepository _repository;
    private readonly GetAssignment _getAssignment;

    public GradeSubmission(ISubmissionRepository repository, GetAssignment getAssignment)
    {
        _repository = repository;
        _getAssignment = getAssignment;
    }

    public async Task<Domain.Submission> ExecuteAsync(Guid id, GradeSubmissionRequest request, Guid actorId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var submission = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Submission '{id}' was not found.");

        var assignment = await _getAssignment.ByIdAsync(submission.AssignmentId, cancellationToken);

        if (!isAdmin && assignment.TeacherId != actorId)
        {
            throw new BusinessRuleException(
                "Only the teacher owning the assignment can grade this submission.",
                StatusCodes.Status403Forbidden);
        }

        if (request.ObtainedMarks > assignment.MaxMarks)
        {
            throw new BusinessRuleException(
                $"Awarded marks cannot exceed the assignment's maximum marks ({assignment.MaxMarks}).",
                StatusCodes.Status409Conflict);
        }

        submission.ObtainedMarks = request.ObtainedMarks;
        submission.TeacherFeedback = request.TeacherFeedback;
        submission.Status = SubmissionStatus.Graded;
        submission.ReviewedAt = DateTime.UtcNow;
        submission.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(submission, cancellationToken);
        return submission;
    }
}