using DotNetEnv;
using AssignmentManagement.Infrastructure;
using AssignmentManagement.Infrastructure.Database;
using AssignmentManagement.Shared.Extensions;

Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
    ?? builder.Configuration["JwtSettings:Secret"] ?? string.Empty;
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
    ?? builder.Configuration["JwtSettings:Issuer"] ?? "AssignmentSystem";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
    ?? builder.Configuration["JwtSettings:Audience"] ?? "AssignmentSystemUsers";
var jwtExpirationInMinutes =
    int.TryParse(Environment.GetEnvironmentVariable("JWT_EXPIRATION_IN_MINUTES"), out var envExpiration)
        ? envExpiration
        : builder.Configuration.GetValue<int?>("JwtSettings:ExpirationInMinutes") ?? 120;

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add application infrastructure (DbContext, repositories, authentication, etc.)
if (!string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddAssignmentInfrastructure(connectionString, jwtSecret, jwtIssuer, jwtAudience, jwtExpirationInMinutes);
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseExceptionHandling();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
   .WithName("HealthCheck");

// Apply database migrations and seed default data when a database is configured.
var skipDatabaseInitialization = string.Equals(
    Environment.GetEnvironmentVariable("SKIP_DATABASE_INITIALIZATION"), "true", StringComparison.OrdinalIgnoreCase);

if (!string.IsNullOrWhiteSpace(connectionString) && !skipDatabaseInitialization)
{
    await using var scope = app.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseSeed");
    await DatabaseSeeder.SeedAsync(dbContext, logger);
}

app.Run();

// Exposed so WebApplicationFactory can bootstrap the API in integration tests.
public partial class Program
{
}
