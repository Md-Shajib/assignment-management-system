using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AssignmentManagement.Domain;

namespace AssignmentManagement.Infrastructure.Database.Configurations;

/// <summary>
/// EF Core configuration for the <see cref="Domain.User"/> entity.
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("user");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.FullName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(255);
        builder.Property(u => u.PasswordHash).IsRequired().HasMaxLength(255);

        builder.HasIndex(u => u.Email).IsUnique();
    }
}
