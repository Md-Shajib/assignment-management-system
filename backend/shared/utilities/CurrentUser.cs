using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;

namespace AssignmentManagement.Shared.Utilities;


// Helpers for reading the authenticated user's details from JWT claims.
public static class CurrentUser
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return Guid.TryParse(value, out var userId) ? userId : null;
    }

    public static string? GetEmail(this ClaimsPrincipal principal)
        => principal.FindFirst(ClaimTypes.Email)?.Value
           ?? principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value;

    public static string? GetRole(this ClaimsPrincipal principal)
        => principal.FindFirst(ClaimTypes.Role)?.Value;

    public static bool IsInRole(this ClaimsPrincipal principal, string role)
        => string.Equals(principal.GetRole(), role, StringComparison.OrdinalIgnoreCase);

    // Returns the authenticated user's id or throws a 401 business exception.
    public static Guid RequireUserId(this ClaimsPrincipal principal)
        => principal.GetUserId()
           ?? throw new BusinessRuleException("Authenticated user could not be identified.", StatusCodes.Status401Unauthorized);
}
