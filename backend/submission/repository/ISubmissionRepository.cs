using AssignmentManagement.Domain;

namespace AssignmentManagement.Submission.Repositories;

/// <summary>
/// Contract for persistence operations over <see cref="Domain.Submission"/> entities.
/// </summary>
public interface ISubmissionRepository
{
    Task<Domain.Submission?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Domain.Submission?> GetByAssignmentAndStudentAsync(Guid assignmentId, Guid studentId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Submission>> GetByAssignmentAsync(Guid assignmentId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Domain.Submission>> GetByStudentAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task AddAsync(Domain.Submission submission, CancellationToken cancellationToken = default);
    Task UpdateAsync(Domain.Submission submission, CancellationToken cancellationToken = default);
}
