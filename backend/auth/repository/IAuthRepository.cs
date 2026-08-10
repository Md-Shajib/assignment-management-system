using AssignmentManagement.Domain;

namespace AssignmentManagement.Auth.Repositories;

/// <summary>
/// Contract for authentication-related persistence operations.
/// </summary>
public interface IAuthRepository
{
    Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
}
