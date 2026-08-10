using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Assignment.Repositories;

namespace AssignmentManagement.Assignment.UseCases;

/// <summary>
/// Retrieves assignments, optionally filtered by course.
/// </summary>
public class GetAssignment
{
    private readonly IAssignmentRepository _repository;

    public GetAssignment(IAssignmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Domain.Assignment> ByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Assignment '{id}' was not found.");

    public async Task<IReadOnlyList<Domain.Assignment>> AllAsync(Guid? courseId, CancellationToken cancellationToken = default)
        => courseId.HasValue
            ? await _repository.GetByCourseAsync(courseId.Value, cancellationToken)
            : await _repository.GetAllAsync(cancellationToken);
}
