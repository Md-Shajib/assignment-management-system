using AssignmentManagement.Shared.Constants;

namespace AssignmentManagement.Domain;

/// <summary>
/// Represents a student's submission for an <see cref="Assignment"/>,
/// together with the awarded marks and teacher feedback.
/// </summary>
public class Submission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AssignmentId { get; set; }
    public Assignment? Assignment { get; set; }
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }
    public string? SubmissionText { get; set; }
    public string? Attachment { get; set; }
    public string Status { get; set; } = SubmissionStatus.Submitted;
    public decimal? ObtainedMarks { get; set; }
    public string? TeacherFeedback { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
