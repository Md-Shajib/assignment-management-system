using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AssignmentManagement.Infrastructure.Database;

/// <summary>
/// Design-time factory used by `dotnet ef` to build the <see cref="ApplicationDbContext"/>
/// without starting the application host. Connection settings are read from environment
/// variables (e.g. a local `.env` file) with sensible development defaults.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        Env.TraversePath().Load();

        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
            ?? BuildConnectionString();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new ApplicationDbContext(options);
    }

    private static string BuildConnectionString()
    {
        var host = Setting("DB_HOST", "localhost");
        var port = Setting("POSTGRES_PORT", "5432");
        var database = Setting("POSTGRES_DB", "assignment_management");
        var username = Setting("POSTGRES_USER", "postgres");
        var password = Setting("POSTGRES_PASSWORD", "postgres");
        return $"Host={host};Port={port};Database={database};Username={username};Password={password}";
    }

    private static string Setting(string key, string fallback)
        => Environment.GetEnvironmentVariable(key) ?? fallback;
}