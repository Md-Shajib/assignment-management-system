using AssignmentManagement.Domain;
using AssignmentManagement.Teacher.Dtos;

namespace AssignmentManagement.Teacher.Transformers;

/// <summary>
/// Maps teacher domain entities into response DTOs.
/// </summary>
public class TeacherResponseTransformer
{
    public TeacherResponse ToResponse(Domain.Teacher teacher)
        => new()
        {
            Id = teacher.Id,
            UserId = teacher.UserId,
            FullName = teacher.FullName,
            Email = teacher.Email
        };
}