using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AssignmentManagement.Domain;

namespace AssignmentManagement.Infrastructure.Database.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="Domain.Teacher"/> entity.
/// </summary>
public class TeacherConfiguration : IEntityTypeConfiguration<Domain.Teacher>
{
    public void Configure(EntityTypeBuilder<Domain.Teacher> builder)
    {
        builder.ToTable("teacher");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.FullName).IsRequired().HasMaxLength(100);
        builder.Property(t => t.Email).IsRequired().HasMaxLength(255);

        builder.HasMany(t => t.Courses)
            .WithOne(c => c.Teacher)
            .HasForeignKey(c => c.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
