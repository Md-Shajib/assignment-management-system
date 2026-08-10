using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AssignmentManagement.Domain;

namespace AssignmentManagement.Infrastructure.Database.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="Domain.Course"/> entity.
/// </summary>
public class CourseConfiguration : IEntityTypeConfiguration<Domain.Course>
{
    public void Configure(EntityTypeBuilder<Domain.Course> builder)
    {
        builder.ToTable("course");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Code).HasMaxLength(20);
    }
}
