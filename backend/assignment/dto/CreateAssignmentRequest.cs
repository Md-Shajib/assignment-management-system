using AssignmentManagement.Domain;

namespace AssignmentManagement.Assignment.Dtos;

/// <summary>
/// Request payload used to create a new assignment.
/// </summary>
public class CreateAssignmentRequest
{
    public Guid CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MaxMarks { get; set; }
    public DateTime Deadline { get; set; }
}

/// <summary>
/// Extension helper mapping a create request to a new assignment entity.
/// </summary>
public static class CreateAssignmentRequestExtensions
{
    public static Domain.Assignment ToEntity(this CreateAssignmentRequest request, Guid teacherId)
        => new()
        {
            CourseId = request.CourseId,
            TeacherId = teacherId,
            Title = request.Title,
            Description = request.Description,
            MaxMarks = request.MaxMarks,
            Deadline = request.Deadline,
            Status = Shared.Constants.AssignmentStatus.Draft
        };
}
