using AssignmentManagement.Shared.Constants;

namespace AssignmentManagement.Domain;

/// <summary>
/// Represents an assignment created by a teacher for a <see cref="Course"/>.
/// </summary>
public class Assignment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CourseId { get; set; }
    public Course? Course { get; set; }
    public Guid TeacherId { get; set; }
    public Teacher? Teacher { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MaxMarks { get; set; }
    public DateTime Deadline { get; set; }
    public string Status { get; set; } = AssignmentStatus.Draft;
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
