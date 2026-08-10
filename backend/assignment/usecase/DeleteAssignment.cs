using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Assignment.Repositories;

namespace AssignmentManagement.Assignment.UseCases;

/// <summary>
/// Soft-deletes an assignment. Assignments with existing submissions cannot be hard-deleted.
/// </summary>
public class DeleteAssignment
{
    private readonly IAssignmentRepository _repository;

    public DeleteAssignment(IAssignmentRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(Guid id, Guid actorId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var assignment = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Assignment '{id}' was not found.");

        if (!isAdmin && assignment.TeacherId != actorId)
        {
            throw new BusinessRuleException(
                "Only the owning teacher can delete this assignment.",
                StatusCodes.Status403Forbidden);
        }

        await _repository.DeleteAsync(assignment, cancellationToken);
    }
}