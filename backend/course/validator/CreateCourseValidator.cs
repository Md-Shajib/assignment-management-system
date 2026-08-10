using FluentValidation;
using AssignmentManagement.Course.Dtos;

namespace AssignmentManagement.Course.Validators;

/// <summary>
/// Validates the payload used to create a course.
/// </summary>
public class CreateCourseValidator : AbstractValidator<CreateCourseRequest>
{
    public CreateCourseValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Code).MaximumLength(20);
    }
}