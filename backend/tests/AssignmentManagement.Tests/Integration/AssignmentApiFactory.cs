using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using AssignmentManagement.Infrastructure.Database;

namespace AssignmentManagement.Tests.Integration;

/// <summary>
/// Bootstraps the real API host over a throw-away SQLite file database,
/// bypassing the startup migration/seeder (schema is created with EnsureCreated).
/// </summary>
public class AssignmentApiFactory : WebApplicationFactory<Program>
{
    private readonly string _dbPath = Path.Combine(Path.GetTempPath(), $"assignment-management-tests-{Guid.NewGuid():N}.db");

    public AssignmentApiFactory()
    {
        Environment.SetEnvironmentVariable("DB_CONNECTION_STRING", "Host=localhost;Database=test;Username=test;Password=test");
        Environment.SetEnvironmentVariable("JWT_SECRET", "test-secret-key-that-is-at-least-32-characters!");
        Environment.SetEnvironmentVariable("JWT_ISSUER", "AssignmentSystem");
        Environment.SetEnvironmentVariable("JWT_AUDIENCE", "AssignmentSystemUsers");
        Environment.SetEnvironmentVariable("JWT_EXPIRATION_IN_MINUTES", "120");
        Environment.SetEnvironmentVariable("SKIP_DATABASE_INITIALIZATION", "true");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<ApplicationDbContext>));
            services.RemoveAll(typeof(DbContextOptions));
            services.RemoveAll(typeof(IDbContextOptionsConfiguration<ApplicationDbContext>));
            services.AddDbContext<ApplicationDbContext>(options => options.UseSqlite($"Data Source={_dbPath}"));
        });
    }

    /// <summary>
    /// Drops and recreates the schema so each test starts from a clean database.
    /// </summary>
    public async Task ResetDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (File.Exists(_dbPath))
        {
            SqliteConnection.ClearAllPools();
            try
            {
                File.Delete(_dbPath);
            }
            catch (IOException)
            {
            }
        }
    }
}