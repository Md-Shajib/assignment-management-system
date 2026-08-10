namespace AssignmentManagement.Auth.Dtos;

// Request payload used by an Admin to create a new user account.
public class RegisterRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
