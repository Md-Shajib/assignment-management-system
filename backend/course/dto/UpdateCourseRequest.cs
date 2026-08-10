namespace AssignmentManagement.Course.Dtos;

/// <summary>
/// Request payload used to update an existing course.
/// </summary>
public class UpdateCourseRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
}