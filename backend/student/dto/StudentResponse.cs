namespace AssignmentManagement.Student.Dtos;

/// <summary>
/// Response payload representing a student profile.
/// </summary>
public class StudentResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? CourseId { get; set; }
}