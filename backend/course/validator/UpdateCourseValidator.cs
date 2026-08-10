using FluentValidation;
using AssignmentManagement.Course.Dtos;

namespace AssignmentManagement.Course.Validators;

/// <summary>
/// Validates the payload used to update a course.
/// </summary>
public class UpdateCourseValidator : AbstractValidator<UpdateCourseRequest>
{
    public UpdateCourseValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Code).MaximumLength(20);
    }
}