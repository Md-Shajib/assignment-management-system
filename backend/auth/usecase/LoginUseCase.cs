using AssignmentManagement.Auth.Repositories;
using AssignmentManagement.Auth.Transformers;
using AssignmentManagement.Auth.Dtos;
using AssignmentManagement.Infrastructure.Authentication;

namespace AssignmentManagement.Auth.UseCases;

// Authenticates a user's credentials and issues a JWT access token.
public class LoginUseCase
{
    private readonly IAuthRepository _repository;
    private readonly AuthTransformer _transformer;

    public LoginUseCase(IAuthRepository repository, AuthTransformer transformer)
    {
        _repository = repository;
        _transformer = transformer;
    }

    // Returns null when the credentials are invalid or the account is inactive.
    public async Task<AuthResponse?> ExecuteAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _repository.GetUserByEmailAsync(request.Email, cancellationToken);
        if (user is null || !user.IsActive || !PasswordHasher.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        return _transformer.ToResponse(user);
    }
}
