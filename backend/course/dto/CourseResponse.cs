namespace AssignmentManagement.Course.Dtos;

/// <summary>
/// Response payload representing a course.
/// </summary>
public class CourseResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public Guid? TeacherId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}