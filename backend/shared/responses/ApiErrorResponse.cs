namespace AssignmentManagement.Shared.Responses;

/// <summary>
/// A single field-level validation error included in error responses.
/// </summary>
public class FieldError
{
    public string Field { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// Standard error response envelope returned by the API when a request fails.
/// </summary>
public class ApiErrorResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = "An error occurred.";
    public List<FieldError>? Errors { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public static ApiErrorResponse BadRequest(string message, List<FieldError>? errors = null)
        => new() { Success = false, Message = message, Errors = errors };
}
