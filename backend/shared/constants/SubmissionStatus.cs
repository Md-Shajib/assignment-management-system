namespace AssignmentManagement.Shared.Constants;

/// <summary>
/// Possible lifecycle states of a <see cref="AssignmentManagement.Domain.Submission"/>.
/// </summary>
public static class SubmissionStatus
{
    public const string Submitted = "Submitted";
    public const string LateSubmitted = "LateSubmitted";
    public const string Graded = "Graded";
}