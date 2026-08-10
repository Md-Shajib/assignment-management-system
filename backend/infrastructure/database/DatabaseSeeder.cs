using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using AssignmentManagement.Domain;
using AssignmentManagement.Infrastructure.Authentication;
using AssignmentManagement.Shared.Constants;

namespace AssignmentManagement.Infrastructure.Database;

/// <summary>
/// Applies pending database migrations and seeds the default Admin user
/// (plus, when opted in, demo sample data for local development).
/// </summary>
public static class DatabaseSeeder
{
    private const int RoleAdmin = 1;
    private const int RoleTeacher = 2;
    private const int RoleStudent = 3;

    public static async Task SeedAsync(ApplicationDbContext context, ILogger logger, CancellationToken cancellationToken = default)
    {
        await context.Database.MigrateAsync(cancellationToken);

        if (!await context.Users.AnyAsync(cancellationToken))
        {
            var email = Setting("SEED_ADMIN_EMAIL", "admin@school.com");
            var name = Setting("SEED_ADMIN_NAME", "System Administrator");
            var password = Setting("SEED_ADMIN_PASSWORD", "Admin123!");

            context.Users.Add(new User
            {
                FullName = name,
                Email = email,
                PasswordHash = PasswordHasher.Hash(password),
                RoleId = RoleAdmin,
                IsActive = true
            });

            await context.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Seeded default admin user '{Email}'.", email);
        }

        if (FlagEnabled("SEED_SAMPLE_DATA"))
        {
            await SeedSampleDataAsync(context, logger, cancellationToken);
        }
    }

    private static async Task SeedSampleDataAsync(ApplicationDbContext context, ILogger logger, CancellationToken cancellationToken = default)
    {
        // Demo teacher account + profile.
        if (!await context.Users.AnyAsync(u => u.Email == "teacher@school.com", cancellationToken))
        {
            var teacherUser = new User
            {
                FullName = "Demo Teacher",
                Email = "teacher@school.com",
                PasswordHash = PasswordHasher.Hash("Password123!"),
                RoleId = RoleTeacher,
                IsActive = true
            };
            context.Users.Add(teacherUser);
            context.Teachers.Add(new Domain.Teacher
            {
                Id = teacherUser.Id,
                UserId = teacherUser.Id,
                FullName = teacherUser.FullName,
                Email = teacherUser.Email
            });
            await context.SaveChangesAsync(cancellationToken);
        }

        var teacher = await context.Teachers.FirstAsync(t => t.Email == "teacher@school.com", cancellationToken);

        // Course taught by the demo teacher.
        var course = await context.Courses.FirstOrDefaultAsync(c => c.Code == "MATH101", cancellationToken);
        if (course is null)
        {
            course = new Domain.Course
            {
                Name = "Mathematics 101",
                Code = "MATH101",
                TeacherId = teacher.Id
            };
            context.Courses.Add(course);
            await context.SaveChangesAsync(cancellationToken);
        }

        // Demo student account + profile, enrolled in the course.
        if (!await context.Users.AnyAsync(u => u.Email == "student@school.com", cancellationToken))
        {
            var studentUser = new User
            {
                FullName = "Demo Student",
                Email = "student@school.com",
                PasswordHash = PasswordHasher.Hash("Password123!"),
                RoleId = RoleStudent,
                IsActive = true
            };
            context.Users.Add(studentUser);
            context.Students.Add(new Domain.Student
            {
                Id = studentUser.Id,
                UserId = studentUser.Id,
                FullName = studentUser.FullName,
                Email = studentUser.Email,
                CourseId = course.Id
            });
            await context.SaveChangesAsync(cancellationToken);
        }

        // Published sample assignment so the demo student can submit.
        if (!await context.Assignments.AnyAsync(a => a.Title == "Sample Assignment" && a.CourseId == course.Id, cancellationToken))
        {
            context.Assignments.Add(new Domain.Assignment
            {
                CourseId = course.Id,
                TeacherId = teacher.Id,
                Title = "Sample Assignment",
                Description = "Solve the practice problems and submit your answers.",
                MaxMarks = 100,
                Deadline = DateTime.UtcNow.AddDays(7),
                LateSubmissionEndDate = DateTime.UtcNow.AddDays(10),
                Status = AssignmentStatus.Published
            });
            await context.SaveChangesAsync(cancellationToken);
        }

        logger.LogInformation("Seeded demo sample data for local development.");
    }

    private static string Setting(string key, string fallback)
        => Environment.GetEnvironmentVariable(key) ?? fallback;

    private static bool FlagEnabled(string key)
        => bool.TryParse(Environment.GetEnvironmentVariable(key), out var enabled) && enabled;
}