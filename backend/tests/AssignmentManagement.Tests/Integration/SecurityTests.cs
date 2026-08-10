using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Xunit;
using AssignmentManagement.Shared.Constants;

namespace AssignmentManagement.Tests.Integration;

public class SecurityTests : IClassFixture<AssignmentApiFactory>
{
    private const string Password = "Password123!";

    private readonly AssignmentApiFactory _factory;

    public SecurityTests(AssignmentApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        await _factory.ResetDatabaseAsync();

        using var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/v1/auth/login", new { email = "nobody@school.com", password = Password });

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task AnonymousRequest_ToProtectedEndpoint_ReturnsUnauthorized()
    {
        await _factory.ResetDatabaseAsync();

        using var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/courses");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Student_AttemptingAdminWrite_IsForbidden()
    {
        await _factory.ResetDatabaseAsync();
        await ApiTestHelpers.SeedUserAsync(_factory, Roles.Student, "student@school.com", Password);

        using var student = await ApiTestHelpers.AuthorizedClientAsync(_factory, "student@school.com", Password);
        var response = await student.PostAsJsonAsync("/api/v1/courses", new { name = "Hacked", code = "HACK" });

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}