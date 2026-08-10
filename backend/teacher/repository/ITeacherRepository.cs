using AssignmentManagement.Domain;

namespace AssignmentManagement.Teacher.Repositories;

/// <summary>
/// Contract for persistence operations over <see cref="Domain.Teacher"/> profiles.
/// </summary>
public interface ITeacherRepository
{
    Task<Domain.Teacher?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Domain.Teacher?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Teacher>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Domain.Teacher teacher, CancellationToken cancellationToken = default);
    Task UpdateAsync(Domain.Teacher teacher, CancellationToken cancellationToken = default);
}
