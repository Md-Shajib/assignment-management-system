namespace AssignmentManagement.Teacher.Dtos;

/// <summary>
/// Response payload representing a teacher profile.
/// </summary>
public class TeacherResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}