using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using AssignmentManagement.Auth.Repositories;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.Transformers;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Course.Repositories;
using AssignmentManagement.Student.Repositories;
using AssignmentManagement.Submission.Repositories;
using AssignmentManagement.Teacher.Repositories;
using AssignmentManagement.Infrastructure.Database;
using AssignmentManagement.Infrastructure.Repositories;

namespace AssignmentManagement.Infrastructure;

/// <summary>
/// Central composition root that registers all infrastructure and feature services.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddAssignmentInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        // Repositories.
        services.AddScoped<IAssignmentRepository, AssignmentRepository>();
        services.AddScoped<ITeacherRepository, TeacherRepository>();
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<ISubmissionRepository, SubmissionRepository>();
        services.AddScoped<IAuthRepository, AuthRepository>();

        // Transformers.
        services.AddScoped<AssignmentRequestTransformer>();
        services.AddScoped<AssignmentResponseTransformer>();

        // Use cases.
        services.AddScoped<CreateAssignment>();
        services.AddScoped<UpdateAssignment>();
        services.AddScoped<DeleteAssignment>();
        services.AddScoped<GetAssignment>();

        // TODO: Register authentication (JwtBearer), remaining feature use cases and validators.
        return services;
    }
}
