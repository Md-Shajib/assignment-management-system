using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Assignment.Repositories;

namespace AssignmentManagement.Assignment.UseCases;

/// <summary>
/// Publishes a draft assignment, transitioning it from <see cref="AssignmentStatus.Draft"/> to <see cref="AssignmentStatus.Published"/>.
/// The deadline must still be in the future, and only the owning teacher (or an Admin) may publish.
/// </summary>
public class PublishAssignment
{
    private readonly IAssignmentRepository _repository;

    public PublishAssignment(IAssignmentRepository repository)
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
                "Only the owning teacher can publish this assignment.",
                StatusCodes.Status403Forbidden);
        }

        if (assignment.Status == AssignmentStatus.Published)
        {
            return assignment;
        }

        if (assignment.Status != AssignmentStatus.Draft)
        {
            throw new BusinessRuleException("Only draft assignments can be published.");
        }

        if (assignment.Deadline <= DateTime.UtcNow)
        {
            throw new BusinessRuleException("Cannot publish an assignment whose deadline has already passed.");
        }

        assignment.Status = AssignmentStatus.Published;
        assignment.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(assignment, cancellationToken);
        return assignment;
    }
}