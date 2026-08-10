using Microsoft.EntityFrameworkCore;
using AssignmentManagement.Domain;
using AssignmentManagement.Infrastructure.Database.Configurations;

namespace AssignmentManagement.Infrastructure.Database;

/// <summary>
/// Entity Framework Core database context for the assignment management system.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public const string Schema = "public";

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Domain.User> Users => Set<Domain.User>();
    public DbSet<Domain.Teacher> Teachers => Set<Domain.Teacher>();
    public DbSet<Domain.Student> Students => Set<Domain.Student>();
    public DbSet<Domain.Course> Courses => Set<Domain.Course>();
    public DbSet<Domain.Assignment> Assignments => Set<Domain.Assignment>();
    public DbSet<Domain.Submission> Submissions => Set<Domain.Submission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Soft delete global query filters.
        modelBuilder.Entity<Domain.User>().HasQueryFilter(u => !u.IsDeleted);
        modelBuilder.Entity<Domain.Course>().HasQueryFilter(c => !c.IsDeleted);
        modelBuilder.Entity<Domain.Assignment>().HasQueryFilter(a => !a.IsDeleted);

        base.OnModelCreating(modelBuilder);
    }
}
