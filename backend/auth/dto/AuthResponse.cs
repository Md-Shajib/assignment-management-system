namespace AssignmentManagement.Auth.Dtos;

// Response payload returned after a successful login or registration.
public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public long ExpiresIn { get; set; }
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
