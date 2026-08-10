using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AssignmentManagement.Domain;

namespace AssignmentManagement.Infrastructure.Database.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="Domain.Student"/> entity.
/// </summary>
public class StudentConfiguration : IEntityTypeConfiguration<Domain.Student>
{
    public void Configure(EntityTypeBuilder<Domain.Student> builder)
    {
        builder.ToTable("student");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.FullName).IsRequired().HasMaxLength(100);
        builder.Property(s => s.Email).IsRequired().HasMaxLength(255);

        builder.HasOne(s => s.Course)
            .WithMany(c => c.Students)
            .HasForeignKey(s => s.CourseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
