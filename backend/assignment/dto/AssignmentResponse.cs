namespace AssignmentManagement.Assignment.Dtos;

/// <summary>
/// Response payload returned to clients representing an assignment.
/// </summary>
public class AssignmentResponse
{
    public Guid Id { get; set; }
    public Guid CourseId { get; set; }
    public Guid TeacherId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MaxMarks { get; set; }
    public DateTime Deadline { get; set; }
    public DateTime? LateSubmissionEndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
