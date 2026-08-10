using AssignmentManagement.Domain;

namespace AssignmentManagement.Assignment.Dtos;

/// <summary>
/// Request payload used to update an existing assignment.
/// </summary>
public class UpdateAssignmentRequest
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MaxMarks { get; set; }
    public DateTime Deadline { get; set; }
    public DateTime? LateSubmissionEndDate { get; set; }
}

/// <summary>
/// Extension helper applying an update request onto an existing assignment entity.
/// </summary>
public static class UpdateAssignmentRequestExtensions
{
    public static void ApplyTo(this UpdateAssignmentRequest request, Domain.Assignment assignment)
    {
        assignment.Title = request.Title;
        assignment.Description = request.Description;
        assignment.MaxMarks = request.MaxMarks;
        assignment.Deadline = request.Deadline;
        assignment.LateSubmissionEndDate = request.LateSubmissionEndDate;
        assignment.UpdatedAt = DateTime.UtcNow;
    }
}
