using FluentValidation;
using AssignmentManagement.Teacher.Dtos;

namespace AssignmentManagement.Teacher.Validators;

/// <summary>
/// Validates the payload used to assign a teacher to a course (or unassign).
/// </summary>
public class AssignTeacherValidator : AbstractValidator<AssignTeacherRequest>
{
    public AssignTeacherValidator()
    {
        RuleFor(x => x.TeacherId).NotEmpty();
        RuleFor(x => x.CourseId).NotEmpty();
    }
}