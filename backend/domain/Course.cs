namespace AssignmentManagement.Domain;

/// <summary>
/// Represents an academic course (equivalent to a class/subject combination)
/// to which teachers are assigned and students are enrolled.
/// </summary>
public class Course
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public bool IsDeleted { get; set; }
    public Guid? TeacherId { get; set; }
    public Teacher? Teacher { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    public ICollection<Student> Students { get; set; } = new List<Student>();
}
