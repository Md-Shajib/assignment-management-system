using FluentValidation;
using AssignmentManagement.Student.Dtos;

namespace AssignmentManagement.Student.Validators;

/// <summary>
/// Validates the payload used to enroll a student into (or unenroll from) a course.
/// </summary>
public class EnrollStudentValidator : AbstractValidator<EnrollStudentRequest>
{
    public EnrollStudentValidator()
    {
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.CourseId).NotEmpty();
    }
}