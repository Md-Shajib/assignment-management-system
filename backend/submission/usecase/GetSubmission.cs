using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Submission.Repositories;

namespace AssignmentManagement.Submission.UseCases;

/// <summary>
/// Retrieves submissions with a variety of filters.
/// </summary>
public class GetSubmission
{
    private readonly ISubmissionRepository _repository;

    public GetSubmission(ISubmissionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Domain.Submission> ByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Submission '{id}' was not found.");

    public async Task<IReadOnlyList<Domain.Submission>> ByAssignmentAsync(Guid assignmentId, CancellationToken cancellationToken = default)
        => await _repository.GetByAssignmentAsync(assignmentId, cancellationToken);

    public async Task<IReadOnlyList<Domain.Submission>> ByStudentAsync(Guid studentId, CancellationToken cancellationToken = default)
        => await _repository.GetByStudentAsync(studentId, cancellationToken);

    public async Task<IReadOnlyList<Domain.Submission>> AllAsync(CancellationToken cancellationToken = default)
        => await _repository.GetAllAsync(cancellationToken);
}