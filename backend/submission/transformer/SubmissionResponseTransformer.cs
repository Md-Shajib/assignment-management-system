using AssignmentManagement.Submission.Dtos;

namespace AssignmentManagement.Submission.Transformers;

/// <summary>
/// Maps domain entities into response DTOs.
/// </summary>
public class SubmissionResponseTransformer
{
    public SubmissionResponse ToResponse(Domain.Submission submission)
        => new()
        {
            Id = submission.Id,
            AssignmentId = submission.AssignmentId,
            StudentId = submission.StudentId,
            SubmissionText = submission.SubmissionText,
            Attachment = submission.Attachment,
            Status = submission.Status,
            ObtainedMarks = submission.ObtainedMarks,
            TeacherFeedback = submission.TeacherFeedback,
            ReviewedAt = submission.ReviewedAt,
            CreatedAt = submission.CreatedAt,
            UpdatedAt = submission.UpdatedAt
        };
}