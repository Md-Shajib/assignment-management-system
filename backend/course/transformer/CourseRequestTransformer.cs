using AssignmentManagement.Domain;
using AssignmentManagement.Course.Dtos;

namespace AssignmentManagement.Course.Transformers;

/// <summary>
/// Maps external course requests into domain entities.
/// </summary>
public class CourseRequestTransformer
{
    public Domain.Course ToEntity(CreateCourseRequest request)
        => new()
        {
            Name = request.Name.Trim(),
            Code = request.Code?.Trim()
        };

    public void ApplyTo(UpdateCourseRequest request, Domain.Course course)
    {
        course.Name = request.Name.Trim();
        course.Code = request.Code?.Trim();
        course.UpdatedAt = DateTime.UtcNow;
    }
}