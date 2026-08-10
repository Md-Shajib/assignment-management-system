using Microsoft.AspNetCore.Mvc;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Auth.Delivery;

/// <summary>
/// Exposes authentication operations over the REST API.
/// </summary>
[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] object request, CancellationToken cancellationToken)
    {
        // TODO: Implement login; validate credentials, generate JWT, return token payload.
        return Ok(ApiResponse<object>.Ok(new { message = "Login is not implemented yet." }));
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] object request, CancellationToken cancellationToken)
    {
        // TODO: Implement user registration (Admin role creation).
        return Ok(ApiResponse<object>.Ok(new { message = "Registration is not implemented yet." }));
    }
}
