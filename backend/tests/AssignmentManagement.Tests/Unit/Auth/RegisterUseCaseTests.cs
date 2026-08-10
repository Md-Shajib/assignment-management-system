using Xunit;
using Moq;
using FluentAssertions;
using AssignmentManagement.Auth.Dtos;
using AssignmentManagement.Auth.Repositories;
using AssignmentManagement.Auth.Transformers;
using AssignmentManagement.Auth.UseCases;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Student.Repositories;
using AssignmentManagement.Teacher.Repositories;
using AssignmentManagement.Infrastructure.Authentication;
using Microsoft.AspNetCore.Http;

namespace AssignmentManagement.Tests.Unit.Auth;

public class RegisterUseCaseTests
{
    private readonly Mock<IAuthRepository> _authRepository = new();
    private readonly Mock<ITeacherRepository> _teacherRepository = new();
    private readonly Mock<IStudentRepository> _studentRepository = new();
    private readonly AuthTransformer _transformer =
        new(new JwtService("test-secret-key-that-is-at-least-32-characters!", "test-issuer", "test-audience", 60));

    private RegisterUseCase CreateSut()
        => new(_authRepository.Object, _teacherRepository.Object, _studentRepository.Object, _transformer);

    private static RegisterRequest Request(string role)
        => new() { FullName = "Test User", Email = "user@school.com", Password = "Password123!", Role = role };

    [Fact]
    public async Task ExecuteAsync_InvalidRole_Throws()
    {
        var act = () => CreateSut().ExecuteAsync(Request("Manager"), CancellationToken.None);

        await act.Should().ThrowAsync<BusinessRuleException>();
    }

    [Fact]
    public async Task ExecuteAsync_DuplicateEmail_ThrowsConflict()
    {
        _authRepository.Setup(r => r.EmailExistsAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var act = () => CreateSut().ExecuteAsync(Request(Roles.Teacher), CancellationToken.None);

        var ex = await act.Should().ThrowAsync<BusinessRuleException>();
        ex.Which.StatusCode.Should().Be(StatusCodes.Status409Conflict);
    }

    [Fact]
    public async Task ExecuteAsync_TeacherRegistration_CreatesTeacherProfile()
    {
        var result = await CreateSut().ExecuteAsync(Request(Roles.Teacher), CancellationToken.None);

        result.Role.Should().Be(Roles.Teacher);
        _authRepository.Verify(r => r.AddAsync(It.IsAny<Domain.User>(), It.IsAny<CancellationToken>()), Times.Once);
        _teacherRepository.Verify(r => r.AddAsync(It.Is<Domain.Teacher>(t => t.Email == "user@school.com"), It.IsAny<CancellationToken>()), Times.Once);
        _studentRepository.Verify(r => r.AddAsync(It.IsAny<Domain.Student>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ExecuteAsync_StudentRegistration_CreatesStudentProfile()
    {
        var result = await CreateSut().ExecuteAsync(Request(Roles.Student), CancellationToken.None);

        result.Role.Should().Be(Roles.Student);
        _studentRepository.Verify(r => r.AddAsync(It.Is<Domain.Student>(s => s.Email == "user@school.com"), It.IsAny<CancellationToken>()), Times.Once);
        _teacherRepository.Verify(r => r.AddAsync(It.IsAny<Domain.Teacher>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}