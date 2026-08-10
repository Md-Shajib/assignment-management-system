using FluentValidation;
using AssignmentManagement.Assignment.Dtos;

namespace AssignmentManagement.Assignment.Validators;

/// <summary>
/// Validates the payload used to update an assignment.
/// </summary>
public class UpdateAssignmentValidator : AbstractValidator<UpdateAssignmentRequest>
{
    public UpdateAssignmentValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.MaxMarks).GreaterThan(0);
        RuleFor(x => x.Deadline).GreaterThan(DateTime.UtcNow);

        When(x => x.LateSubmissionEndDate.HasValue, () =>
        {
            RuleFor(x => x.LateSubmissionEndDate!.Value)
                .GreaterThan(x => x.Deadline)
                .WithMessage("The late submission end date must be after the deadline.");
        });
    }
}
