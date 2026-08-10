using FluentValidation;
using AssignmentManagement.Auth.Dtos;
using AssignmentManagement.Shared.Constants;

namespace AssignmentManagement.Auth.Validators;

// Validates the payload used by an Admin to create a user account.
public class RegisterValidator : AbstractValidator<RegisterRequest>
{
    public RegisterValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Must(HasUppercase).WithMessage("Password must contain at least one uppercase letter.")
            .Must(HasLowercase).WithMessage("Password must contain at least one lowercase letter.")
            .Must(HasDigit).WithMessage("Password must contain at least one digit.")
            .Must(HasSpecialCharacter).WithMessage("Password must contain at least one special character.");
        RuleFor(x => x.Role)
            .NotEmpty()
            .Must(IsValidRole).WithMessage("Role must be one of: Admin, Teacher, Student.");
    }

    private static bool HasUppercase(string password) => password.Any(char.IsUpper);
    private static bool HasLowercase(string password) => password.Any(char.IsLower);
    private static bool HasDigit(string password) => password.Any(char.IsDigit);
    private static bool HasSpecialCharacter(string password) => password.Any(c => !char.IsLetterOrDigit(c));
    private static bool IsValidRole(string role)
        => role is Roles.Admin or Roles.Teacher or Roles.Student;
}
