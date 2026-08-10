using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Shared.Middleware;

/// <summary>
/// Centralized exception handling middleware.
/// Converts expected business exceptions into structured error responses
/// and logs unexpected errors without leaking sensitive information.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (NotFoundException ex)
        {
            await WriteErrorAsync(context, StatusCodes.Status404NotFound, ex.Message);
        }
        catch (BusinessRuleException ex)
        {
            await WriteErrorAsync(context, ex.StatusCode, ex.Message);
        }
        catch (FluentValidation.ValidationException ex)
        {
            var errors = ex.Errors
                .Select(e => new FieldError { Field = e.PropertyName, Message = e.ErrorMessage })
                .ToList();
            await WriteErrorAsync(context, StatusCodes.Status400BadRequest, "Validation failed.", errors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred while processing the request.");
            await WriteErrorAsync(context, StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, int statusCode, string message, List<FieldError>? errors = null)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        var body = ApiErrorResponse.BadRequest(message, errors);
        await context.Response.WriteAsJsonAsync(body);
    }
}
