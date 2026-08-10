using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using AssignmentManagement.Auth.Transformers;
using AssignmentManagement.Domain;
using AssignmentManagement.Infrastructure.Authentication;
using AssignmentManagement.Infrastructure.Database;
using AssignmentManagement.Shared.Constants;

namespace AssignmentManagement.Tests.Integration;

public static class ApiTestHelpers
{
    public static int RoleAdmin => AuthTransformer.GetRoleId(Roles.Admin)!.Value;
    public static int RoleTeacher => AuthTransformer.GetRoleId(Roles.Teacher)!.Value;
    public static int RoleStudent => AuthTransformer.GetRoleId(Roles.Student)!.Value;

    /// <summary>
    /// Inserts a user directly (with the matching teacher/student profile) so login tests
    /// do not depend on the seeder.
    /// </summary>
    public static async Task<User> SeedUserAsync(AssignmentApiFactory factory, string role, string email, string password)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var roleId = AuthTransformer.GetRoleId(role)!.Value;
        var user = new User
        {
            FullName = $"Test {role}",
            Email = email,
            PasswordHash = PasswordHasher.Hash(password),
            RoleId = roleId,
            IsActive = true
        };
        db.Users.Add(user);

        if (roleId == RoleTeacher)
        {
            db.Teachers.Add(new Domain.Teacher { Id = user.Id, UserId = user.Id, FullName = user.FullName, Email = user.Email });
        }
        else if (roleId == RoleStudent)
        {
            db.Students.Add(new Domain.Student { Id = user.Id, UserId = user.Id, FullName = user.FullName, Email = user.Email });
        }

        await db.SaveChangesAsync();
        return user;
    }

    /// <summary>
    /// Logs in and returns a client with a bearer token attached.
    /// </summary>
    public static async Task<HttpClient> AuthorizedClientAsync(AssignmentApiFactory factory, string email, string password)
    {
        var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/v1/auth/login", new { email, password });
        response.EnsureSuccessStatusCode();

        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var token = doc.RootElement.GetProperty("data").GetProperty("accessToken").GetString();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    public static async Task<Guid> ReadDataGuidAsync(HttpResponseMessage response, string field)
    {
        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        return doc.RootElement.GetProperty("data").GetProperty(field).GetGuid();
    }
}