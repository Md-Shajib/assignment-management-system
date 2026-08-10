namespace AssignmentManagement.Domain;

/// <summary>
/// Represents an application user account (Admin, Teacher, or Student).
/// The concrete business profile is modelled by <see cref="Teacher"/>, <see cref="Student"/>,
/// or an Admin counterpart.
/// </summary>
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
