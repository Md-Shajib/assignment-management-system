namespace AssignmentManagement.Auth.Dtos;

// Request payload used to authenticate an existing user.
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
