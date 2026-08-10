namespace AssignmentManagement.Shared.Responses;

/// <summary>
/// Standard success response envelope returned by all API endpoints.
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; } = true;
    public string Message { get; set; } = "Request completed successfully.";
    public T? Data { get; set; }
    public ApiMeta? Meta { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Request completed successfully.")
        => new() { Success = true, Message = message, Data = data };

    /// <summary>
    /// Creates a success response for a paged list, attaching pagination metadata.
    /// </summary>
    public static ApiResponse<T> Paged(T data, ApiMeta meta, string message = "Request completed successfully.")
        => new() { Success = true, Message = message, Data = data, Meta = meta };
}
