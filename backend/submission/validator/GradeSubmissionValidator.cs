using FluentValidation;
using AssignmentManagement.Submission.Dtos;

namespace AssignmentManagement.Submission.Validators;

/// <summary>
/// Validates the payload used by a teacher to grade a submission.
/// Awarded marks must be non-negative; the upper bound against the
/// assignment's maximum marks is enforced in the use case.
/// </summary>
public class GradeSubmissionValidator : AbstractValidator<GradeSubmissionRequest>
{
    public GradeSubmissionValidator()
    {
        RuleFor(x => x.ObtainedMarks).GreaterThanOrEqualTo(0);
    }
}