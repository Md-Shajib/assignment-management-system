using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AssignmentManagement.Domain;

namespace AssignmentManagement.Infrastructure.Database.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="Domain.Submission"/> entity.
/// </summary>
public class SubmissionConfiguration : IEntityTypeConfiguration<Domain.Submission>
{
    public void Configure(EntityTypeBuilder<Domain.Submission> builder)
    {
        builder.ToTable("submission");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.SubmissionText).HasMaxLength(4000);
        builder.Property(s => s.Attachment).HasMaxLength(500);
        builder.Property(s => s.Status).IsRequired().HasMaxLength(20);
        builder.Property(s => s.ObtainedMarks).HasPrecision(5, 2);

        builder.HasOne(s => s.Assignment)
            .WithMany(a => a.Submissions)
            .HasForeignKey(s => s.AssignmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(s => s.Student)
            .WithMany(st => st.Submissions)
            .HasForeignKey(s => s.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(s => new { s.AssignmentId, s.StudentId }).IsUnique();
    }
}
