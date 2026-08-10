using AssignmentManagement.Domain;
using AssignmentManagement.Course.Dtos;

namespace AssignmentManagement.Course.Transformers;

/// <summary>
/// Maps course domain entities into response DTOs.
/// </summary>
public class CourseResponseTransformer
{
    public CourseResponse ToResponse(Domain.Course course)
        => new()
        {
            Id = course.Id,
            Name = course.Name,
            Code = course.Code,
            TeacherId = course.TeacherId,
            CreatedAt = course.CreatedAt,
            UpdatedAt = course.UpdatedAt
        };
}