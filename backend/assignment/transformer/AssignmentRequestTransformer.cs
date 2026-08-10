using AssignmentManagement.Domain;
using AssignmentManagement.Assignment.Dtos;

namespace AssignmentManagement.Assignment.Transformers;

/// <summary>
/// Maps external requests into domain entities.
/// </summary>
public class AssignmentRequestTransformer
{
    /// <summary>
    /// Creates a new assignment entity in <see cref="Shared.Constants.AssignmentStatus.Draft"/> state.
    /// </summary>
    public Domain.Assignment ToEntity(Assignment.Dtos.CreateAssignmentRequest request, Guid teacherId)
        => request.ToEntity(teacherId);
}
