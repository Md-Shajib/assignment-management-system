using Xunit;
using FluentAssertions;
using AssignmentManagement.Submission.Dtos;
using AssignmentManagement.Submission.Validators;

namespace AssignmentManagement.Tests.Unit.Submission;

public class SubmitValidatorTests
{
    private readonly SubmitValidator _validator = new();

    [Fact]
    public async Task EmptySubmission_IsInvalid()
    {
        var result = await _validator.ValidateAsync(new SubmitRequest { AssignmentId = Guid.NewGuid() });

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public async Task TextOnlySubmission_IsValid()
    {
        var result = await _validator.ValidateAsync(
            new SubmitRequest { AssignmentId = Guid.NewGuid(), SubmissionText = "Here is my solution." });

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task AttachmentOnlySubmission_IsValid()
    {
        var result = await _validator.ValidateAsync(
            new SubmitRequest { AssignmentId = Guid.NewGuid(), Attachment = "answer.pdf" });

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public async Task MissingAssignmentId_IsInvalid()
    {
        var result = await _validator.ValidateAsync(new SubmitRequest { SubmissionText = "answer" });

        result.IsValid.Should().BeFalse();
    }
}