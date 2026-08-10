using AssignmentManagement.Domain;

namespace AssignmentManagement.Student.Repositories;

/// <summary>
/// Contract for persistence operations over <see cref="Domain.Student"/> profiles.
/// </summary>
public interface IStudentRepository
{
    Task<Domain.Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Domain.Student?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Student>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Student>> GetByCourseAsync(Guid courseId, CancellationToken cancellationToken = default);
    Task AddAsync(Domain.Student student, CancellationToken cancellationToken = default);
    Task UpdateAsync(Domain.Student student, CancellationToken cancellationToken = default);
}
