namespace AssignmentManagement.Domain;

/// <summary>
/// Represents a student profile linked to a <see cref="User"/> account.
/// A student can be enrolled in multiple <see cref="Course"/>s.
/// </summary>
public class Student
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? CourseId { get; set; }
    public Course? Course { get; set; }
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
