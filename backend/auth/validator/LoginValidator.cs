using FluentValidation;
using AssignmentManagement.Auth.Dtos;

namespace AssignmentManagement.Auth.Validators;

// Validates the payload used to authenticate a user.
public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
        RuleFor(x => x.Password).NotEmpty();
    }
}
