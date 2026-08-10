using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.Dtos;

namespace AssignmentManagement.Assignment.UseCases;

/// <summary>
/// Updates an existing assignment owned by the requesting teacher.
/// </summary>
public class UpdateAssignment
{
    private readonly IAssignmentRepository _repository;

    public UpdateAssignment(IAssignmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Domain.Assignment> ExecuteAsync(UpdateAssignmentRequest request, Guid teacherId, CancellationToken cancellationToken = default)
    {
        var assignment = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException($"Assignment '{request.Id}' was not found.");

        if (assignment.TeacherId != teacherId)
        {
            throw new BusinessRuleException("Only the owning teacher can update this assignment.");
        }

        request.ApplyTo(assignment);
        await _repository.UpdateAsync(assignment, cancellationToken);
        return assignment;
    }
}
