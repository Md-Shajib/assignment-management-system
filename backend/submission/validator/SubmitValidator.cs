using FluentValidation;
using AssignmentManagement.Submission.Dtos;

namespace AssignmentManagement.Submission.Validators;

/// <summary>
/// Validates the payload used to create or update a student submission.
/// An empty submission (no text and no attachment) is rejected.
/// </summary>
public class SubmitValidator : AbstractValidator<SubmitRequest>
{
    public SubmitValidator()
    {
        RuleFor(x => x.AssignmentId).NotEmpty();

        RuleFor(x => x)
            .Must(r => !string.IsNullOrWhiteSpace(r.SubmissionText) || !string.IsNullOrWhiteSpace(r.Attachment))
            .WithMessage("A submission must contain either text (or a link) or an attachment.");

        When(x => !string.IsNullOrWhiteSpace(x.SubmissionText), () =>
        {
            RuleFor(x => x.SubmissionText!.Trim().Length).InclusiveBetween(1, 4000);
        });

        When(x => !string.IsNullOrWhiteSpace(x.Attachment), () =>
        {
            RuleFor(x => x.Attachment!.Trim().Length).InclusiveBetween(1, 500);
        });
    }
}