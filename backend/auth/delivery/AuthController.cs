using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation.Results;
using AssignmentManagement.Auth.Dtos;
using AssignmentManagement.Auth.UseCases;
using AssignmentManagement.Auth.Validators;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Auth.Delivery;

// Exposes authentication operations over the REST API.
[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly LoginUseCase _loginUseCase;
    private readonly RegisterUseCase _registerUseCase;
    private readonly LoginValidator _loginValidator;
    private readonly RegisterValidator _registerValidator;

    public AuthController(
        LoginUseCase loginUseCase,
        RegisterUseCase registerUseCase,
        LoginValidator loginValidator,
        RegisterValidator registerValidator)
    {
        _loginUseCase = loginUseCase;
        _registerUseCase = registerUseCase;
        _loginValidator = loginValidator;
        _registerValidator = registerValidator;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var validation = await _loginValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        var result = await _loginUseCase.ExecuteAsync(request, cancellationToken);
        if (result is null)
        {
            return Unauthorized(ApiErrorResponse.BadRequest("Invalid email or password."));
        }

        return Ok(ApiResponse<AuthResponse>.Ok(result, "Login successful."));
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var validation = await _registerValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        var result = await _registerUseCase.ExecuteAsync(request, cancellationToken);
        return Ok(ApiResponse<AuthResponse>.Ok(result, "User registered successfully."));
    }

    private static List<FieldError> ToFieldErrors(ValidationResult result)
        => result.Errors
            .Select(e => new FieldError { Field = e.PropertyName, Message = e.ErrorMessage })
            .ToList();
}
