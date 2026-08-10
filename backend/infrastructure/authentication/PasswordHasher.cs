using BCrypt.Net;

namespace AssignmentManagement.Infrastructure.Authentication;

/// <summary>
/// Helper for hashing and verifying passwords using BCrypt.
/// </summary>
public static class PasswordHasher
{
    public static string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(password);

    public static bool Verify(string password, string hashedPassword)
        => BCrypt.Net.BCrypt.Verify(password, hashedPassword);
}
