using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using AssignmentManagement.Auth.Repositories;
using AssignmentManagement.Auth.Transformers;
using AssignmentManagement.Auth.UseCases;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.Transformers;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Course.Repositories;
using AssignmentManagement.Student.Repositories;
using AssignmentManagement.Submission.Repositories;
using AssignmentManagement.Teacher.Repositories;
using AssignmentManagement.Infrastructure.Authentication;
using AssignmentManagement.Infrastructure.Database;
using AssignmentManagement.Infrastructure.Repositories;

namespace AssignmentManagement.Infrastructure;

// Central composition root that registers all infrastructure and feature services.
public static class DependencyInjection
{
    public static IServiceCollection AddAssignmentInfrastructure(
        this IServiceCollection services,
        string connectionString,
        string jwtSecret,
        string jwtIssuer,
        string jwtAudience,
        int jwtExpirationInMinutes)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        // Authentication (JWT / RBAC).
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                    ClockSkew = TimeSpan.Zero
                };
            });
        services.AddAuthorization();
        services.AddScoped<JwtService>(_ => new JwtService(jwtSecret, jwtIssuer, jwtAudience, jwtExpirationInMinutes));

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
        services.AddScoped<AuthTransformer>();

        // Use cases.
        services.AddScoped<CreateAssignment>();
        services.AddScoped<UpdateAssignment>();
        services.AddScoped<DeleteAssignment>();
        services.AddScoped<GetAssignment>();
        services.AddScoped<LoginUseCase>();
        services.AddScoped<RegisterUseCase>();

        // TODO: Register remaining feature use cases and transformers.
        return services;
    }
}
