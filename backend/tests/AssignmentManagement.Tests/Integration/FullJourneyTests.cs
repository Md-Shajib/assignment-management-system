using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Xunit;
using AssignmentManagement.Shared.Constants;

namespace AssignmentManagement.Tests.Integration;

public class FullJourneyTests : IClassFixture<AssignmentApiFactory>
{
    private const string Password = "Password123!";

    private readonly AssignmentApiFactory _factory;

    public FullJourneyTests(AssignmentApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task AssignmentLifecycle_FromCourseToGrade_Succeeds()
    {
        await _factory.ResetDatabaseAsync();

        await ApiTestHelpers.SeedUserAsync(_factory, Roles.Admin, "admin@school.com", Password);
        var teacher = await ApiTestHelpers.SeedUserAsync(_factory, Roles.Teacher, "teacher@school.com", Password);
        var student = await ApiTestHelpers.SeedUserAsync(_factory, Roles.Student, "student@school.com", Password);

        using var admin = await ApiTestHelpers.AuthorizedClientAsync(_factory, "admin@school.com", Password);
        using var teacherClient = await ApiTestHelpers.AuthorizedClientAsync(_factory, "teacher@school.com", Password);
        using var studentClient = await ApiTestHelpers.AuthorizedClientAsync(_factory, "student@school.com", Password);

        // Admin creates a course.
        var courseResponse = await admin.PostAsJsonAsync("/api/v1/courses", new { name = "Mathematics 101", code = "MATH101" });
        courseResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.Created);
        var courseId = await ApiTestHelpers.ReadDataGuidAsync(courseResponse, "id");

        // Admin assigns the teacher and enrolls the student.
        (await admin.PatchAsync($"/api/v1/teachers/{teacher.Id}/courses/{courseId}", null)).StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        (await admin.PatchAsync($"/api/v1/students/{student.Id}/courses/{courseId}", null)).StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        // Teacher creates and publishes an assignment.
        var assignmentResponse = await teacherClient.PostAsJsonAsync("/api/v1/assignments", new
        {
            courseId,
            title = "Midterm Quiz",
            description = "Solve problems 1 to 5.",
            maxMarks = 100,
            deadline = DateTime.UtcNow.AddDays(7)
        });
        assignmentResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        var assignmentId = await ApiTestHelpers.ReadDataGuidAsync(assignmentResponse, "id");

        (await teacherClient.PatchAsync($"/api/v1/assignments/{assignmentId}/publish", null)).StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        // Student submits.
        var submitResponse = await studentClient.PostAsJsonAsync("/api/v1/submissions", new
        {
            assignmentId,
            submissionText = "Here is my solution to problems 1-5."
        });
        submitResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        var submissionId = await ApiTestHelpers.ReadDataGuidAsync(submitResponse, "id");

        // Teacher grades; student can then see the result.
        var gradeResponse = await teacherClient.PatchAsJsonAsync($"/api/v1/submissions/{submissionId}/review", new
        {
            obtainedMarks = 88.5,
            teacherFeedback = "Well done."
        });
        gradeResponse.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);

        var mySubmissions = await studentClient.GetFromJsonAsync<JsonResponse<JsonElement[]>>("/api/v1/submissions/my");
        mySubmissions!.Data!.Select(s => s.GetProperty("obtainedMarks").GetDecimal()).Should().Contain(88.5m);
    }

    private sealed record JsonResponse<T>(bool Success, string Message, T? Data);
}