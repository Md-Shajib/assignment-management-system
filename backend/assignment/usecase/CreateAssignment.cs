using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.Transformers;
using AssignmentManagement.Assignment.Dtos;

namespace AssignmentManagement.Assignment.UseCases;

/// <summary>
/// Creates a new assignment in <see cref="Shared.Constants.AssignmentStatus.Draft"/> state.
/// </summary>
public class CreateAssignment
{
    private readonly IAssignmentRepository _repository;
    private readonly AssignmentRequestTransformer _transformer;

    public CreateAssignment(IAssignmentRepository repository, AssignmentRequestTransformer transformer)
    {
        _repository = repository;
        _transformer = transformer;
    }

    public async Task<Domain.Assignment> ExecuteAsync(CreateAssignmentRequest request, Guid teacherId, CancellationToken cancellationToken = default)
    {
        var assignment = _transformer.ToEntity(request, teacherId);
        await _repository.AddAsync(assignment, cancellationToken);
        return assignment;
    }
}
