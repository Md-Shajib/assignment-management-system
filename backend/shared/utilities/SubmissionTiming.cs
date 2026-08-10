namespace AssignmentManagement.Shared.Utilities;

/// <summary>
/// Evaluates whether a submission is allowed at the current time, based on the
/// assignment's deadline and optional late-submission window.
/// </summary>
public static class SubmissionTiming
{
    /// <summary>
    /// Returns whether a submission is permitted and whether it counts as late.
    /// Submissions are allowed before the deadline, or (when enabled) up to the
    /// late-submission end date; they are fully blocked once the window closes.
    /// </summary>
    public static (bool Allowed, bool IsLate) Evaluate(DateTime now, DateTime deadline, DateTime? lateSubmissionEndDate)
    {
        if (now <= deadline)
        {
            return (true, false);
        }

        if (lateSubmissionEndDate.HasValue && now <= lateSubmissionEndDate.Value)
        {
            return (true, true);
        }

        return (false, false);
    }
}