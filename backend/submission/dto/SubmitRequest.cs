namespace AssignmentManagement.Submission.Dtos;

/// <summary>
/// Request payload used to create or update a student submission.
/// Either <see cref="SubmissionText"/> or <see cref="Attachment"/> (or both) must be provided.
/// </summary>
public class SubmitRequest
{
    public Guid AssignmentId { get; set; }
    public string? SubmissionText { get; set; }
    public string? Attachment { get; set; }
}