using System.IdentityModel.Tokens.Jwt;
using AssignmentManagement.Domain;
using AssignmentManagement.Infrastructure.Authentication;
using AssignmentManagement.Shared.Constants;

namespace AssignmentManagement.Auth.Transformers;


/// Maps <see cref="User"/> entities into authentication responses and
/// centralizes the role-name <-> role-id mapping used across the auth flow.
public class AuthTransformer
{
    private const int RoleAdmin = 1;
    private const int RoleTeacher = 2;
    private const int RoleStudent = 3;

    private readonly JwtService _jwtService;

    public AuthTransformer(JwtService jwtService)
    {
        _jwtService = jwtService;
    }

    // Resolves a role name to its integer id, or null when unknown.
    public static int? GetRoleId(string roleName)
        => roleName switch
        {
            Roles.Admin => RoleAdmin,
            Roles.Teacher => RoleTeacher,
            Roles.Student => RoleStudent,
            _ => null
        };

    // Resolves a role id to its role name, or null when unknown.
    public static string? GetRoleName(int roleId)
        => roleId switch
        {
            RoleAdmin => Roles.Admin,
            RoleTeacher => Roles.Teacher,
            RoleStudent => Roles.Student,
            _ => null
        };

    public Dtos.AuthResponse ToResponse(User user)
    {
        var role = GetRoleName(user.RoleId) ?? string.Empty;
        var token = _jwtService.GenerateToken(user.Id, user.Email, role);

        return new Dtos.AuthResponse
        {
            AccessToken = token,
            ExpiresIn = GetRemainingLifetimeInSeconds(token),
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = role
        };
    }

    private static long GetRemainingLifetimeInSeconds(string token)
    {
        if (new JwtSecurityTokenHandler().ReadJwtToken(token) is { } jwt)
        {
            return Math.Max(0, (long)(jwt.ValidTo - DateTime.UtcNow).TotalSeconds);
        }

        return 0;
    }
}
