using AssignmentManagement.Domain;

namespace AssignmentManagement.Course.Repositories;

/// <summary>
/// Contract for persistence operations over <see cref="Domain.Course"/> entities.
/// </summary>
public interface ICourseRepository
{
    Task<Domain.Course?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Course>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Domain.Course course, CancellationToken cancellationToken = default);
    Task UpdateAsync(Domain.Course course, CancellationToken cancellationToken = default);
    Task DeleteAsync(Domain.Course course, CancellationToken cancellationToken = default);
}
