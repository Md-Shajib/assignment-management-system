using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Shared.Utilities;

/// <summary>
/// Extension helpers shared across the application.
/// </summary>
public static class Extensions
{
    /// <summary>
    /// Converts FluentValidation failures into the standard field error list.
    /// </summary>
    public static List<FieldError> ToFieldErrors(this ValidationException ex)
        => ex.Errors
            .Select(e => new FieldError { Field = e.PropertyName, Message = e.ErrorMessage })
            .ToList();

    /// <summary>
    /// Shortcut for returning a standard bad-request response.
    /// </summary>
    public static BadRequestObjectResult BadRequest(this ControllerBase controller, string message)
        => new(ApiErrorResponse.BadRequest(message));
}
