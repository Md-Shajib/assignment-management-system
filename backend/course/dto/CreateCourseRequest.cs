namespace AssignmentManagement.Course.Dtos;

/// <summary>
/// Request payload used to create a new course.
/// </summary>
public class CreateCourseRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
}