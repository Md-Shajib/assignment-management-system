using AssignmentManagement.Domain;
using AssignmentManagement.Student.Dtos;

namespace AssignmentManagement.Student.Transformers;

/// <summary>
/// Maps student domain entities into response DTOs.
/// </summary>
public class StudentResponseTransformer
{
    public StudentResponse ToResponse(Domain.Student student)
        => new()
        {
            Id = student.Id,
            UserId = student.UserId,
            FullName = student.FullName,
            Email = student.Email,
            CourseId = student.CourseId
        };
}