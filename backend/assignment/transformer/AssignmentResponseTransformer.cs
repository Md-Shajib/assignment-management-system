using AssignmentManagement.Domain;
using AssignmentManagement.Assignment.Dtos;

namespace AssignmentManagement.Assignment.Transformers;

/// <summary>
/// Maps domain entities into response DTOs.
/// </summary>
public class AssignmentResponseTransformer
{
    public AssignmentResponse ToResponse(Domain.Assignment assignment)
        => new()
        {
            Id = assignment.Id,
            CourseId = assignment.CourseId,
            TeacherId = assignment.TeacherId,
            Title = assignment.Title,
            Description = assignment.Description,
            MaxMarks = assignment.MaxMarks,
            Deadline = assignment.Deadline,
            LateSubmissionEndDate = assignment.LateSubmissionEndDate,
            Status = assignment.Status,
            CreatedAt = assignment.CreatedAt,
            UpdatedAt = assignment.UpdatedAt
        };
}
