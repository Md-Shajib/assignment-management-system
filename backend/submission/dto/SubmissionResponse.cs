namespace AssignmentManagement.Submission.Dtos;

/// <summary>
/// Response payload returned to clients representing a submission.
/// </summary>
public class SubmissionResponse
{
    public Guid Id { get; set; }
    public Guid AssignmentId { get; set; }
    public Guid StudentId { get; set; }
    public string? SubmissionText { get; set; }
    public string? Attachment { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal? ObtainedMarks { get; set; }
    public string? TeacherFeedback { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}