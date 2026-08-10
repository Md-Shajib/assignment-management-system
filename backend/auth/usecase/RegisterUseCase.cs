using AssignmentManagement.Domain;
using AssignmentManagement.Auth.Repositories;
using AssignmentManagement.Auth.Transformers;
using AssignmentManagement.Auth.Dtos;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Student.Repositories;
using AssignmentManagement.Teacher.Repositories;
using AssignmentManagement.Infrastructure.Authentication;

namespace AssignmentManagement.Auth.UseCases;

// Creates a new user account (Admin only) and its role profile, then issues a JWT.
public class RegisterUseCase
{
    private readonly IAuthRepository _authRepository;
    private readonly ITeacherRepository _teacherRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly AuthTransformer _transformer;

    public RegisterUseCase(
        IAuthRepository authRepository,
        ITeacherRepository teacherRepository,
        IStudentRepository studentRepository,
        AuthTransformer transformer)
    {
        _authRepository = authRepository;
        _teacherRepository = teacherRepository;
        _studentRepository = studentRepository;
        _transformer = transformer;
    }

    public async Task<AuthResponse> ExecuteAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        var roleId = AuthTransformer.GetRoleId(request.Role)
            ?? throw new BusinessRuleException($"Invalid role '{request.Role}'.");

        if (await _authRepository.EmailExistsAsync(request.Email, cancellationToken))
        {
            throw new BusinessRuleException("A user with this email already exists.", StatusCodes.Status409Conflict);
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = PasswordHasher.Hash(request.Password),
            RoleId = roleId,
            IsActive = true
        };
        await _authRepository.AddAsync(user, cancellationToken);

        if (roleId == AuthTransformer.GetRoleId(Roles.Teacher))
        {
            await _teacherRepository.AddAsync(new Domain.Teacher
            {
                Id = user.Id,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email
            }, cancellationToken);
        }
        else if (roleId == AuthTransformer.GetRoleId(Roles.Student))
        {
            await _studentRepository.AddAsync(new Domain.Student
            {
                Id = user.Id,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email
            }, cancellationToken);
        }

        return _transformer.ToResponse(user);
    }
}
