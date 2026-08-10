using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AssignmentManagement.Domain;

namespace AssignmentManagement.Infrastructure.Database.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="Domain.Assignment"/> entity.
/// </summary>
public class AssignmentConfiguration : IEntityTypeConfiguration<Domain.Assignment>
{
    public void Configure(EntityTypeBuilder<Domain.Assignment> builder)
    {
        builder.ToTable("assignment");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Title).IsRequired().HasMaxLength(200);
        builder.Property(a => a.Description).IsRequired();
        builder.Property(a => a.MaxMarks).HasPrecision(5, 2);
        builder.Property(a => a.Status).IsRequired().HasMaxLength(20);
        builder.Property(a => a.LateSubmissionEndDate);

        builder.HasOne(a => a.Course)
            .WithMany(c => c.Assignments)
            .HasForeignKey(a => a.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Teacher)
            .WithMany()
            .HasForeignKey(a => a.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
