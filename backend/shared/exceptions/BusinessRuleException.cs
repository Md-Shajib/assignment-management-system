namespace AssignmentManagement.Shared.Exceptions;

/// <summary>
/// Base exception for all expected business-rule violations.
/// Use dedicated derived exceptions for specific rules.
/// </summary>
public class BusinessRuleException : Exception
{
    public int StatusCode { get; }

    public BusinessRuleException(string message, int statusCode = StatusCodes.Status400BadRequest)
        : base(message)
    {
        StatusCode = statusCode;
    }
}
