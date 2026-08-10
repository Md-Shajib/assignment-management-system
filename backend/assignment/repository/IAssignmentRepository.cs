using AssignmentManagement.Domain;

namespace AssignmentManagement.Assignment.Repositories;

/// <summary>
/// Contract for persistence operations over <see cref="Domain.Assignment"/> entities.
/// </summary>
public interface IAssignmentRepository
{
    Task<Domain.Assignment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Assignment>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Assignment>> GetByCourseAsync(Guid courseId, CancellationToken cancellationToken = default);
    Task AddAsync(Domain.Assignment assignment, CancellationToken cancellationToken = default);
    Task UpdateAsync(Domain.Assignment assignment, CancellationToken cancellationToken = default);
    Task DeleteAsync(Domain.Assignment assignment, CancellationToken cancellationToken = default);
}
