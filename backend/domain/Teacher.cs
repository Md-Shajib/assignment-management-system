namespace AssignmentManagement.Domain;

/// <summary>
/// Represents a teacher profile linked to a <see cref="User"/> account.
/// </summary>
public class Teacher
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}
