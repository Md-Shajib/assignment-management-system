using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Assignment.Repositories;

namespace AssignmentManagement.Assignment.UseCases;

/// <summary>
/// Closes a published assignment, transitioning it from <see cref="AssignmentStatus.Published"/> to <see cref="AssignmentStatus.Closed"/>.
/// Submissions are fully blocked once the assignment is closed.
/// </summary>
public class CloseAssignment
{
    private readonly IAssignmentRepository _repository;

    public CloseAssignment(IAssignmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Domain.Assignment> ExecuteAsync(Guid id, Guid actorId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var assignment = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Assignment '{id}' was not found.");

        if (!isAdmin && assignment.TeacherId != actorId)
        {
            throw new BusinessRuleException(
                "Only the owning teacher can close this assignment.",
                StatusCodes.Status403Forbidden);
        }

        if (assignment.Status == AssignmentStatus.Closed)
        {
            return assignment;
        }

        if (assignment.Status != AssignmentStatus.Published)
        {
            throw new BusinessRuleException("Only published assignments can be closed.");
        }

        assignment.Status = AssignmentStatus.Closed;
        assignment.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(assignment, cancellationToken);
        return assignment;
    }
}