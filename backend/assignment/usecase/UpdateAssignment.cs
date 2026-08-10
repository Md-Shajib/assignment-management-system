using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.Dtos;

namespace AssignmentManagement.Assignment.UseCases;

/// <summary>
/// Updates an existing assignment owned by the requesting teacher (or an Admin).
/// Guards: unique title within the course, and immutable max marks once graded submissions exist.
/// </summary>
public class UpdateAssignment
{
    private readonly IAssignmentRepository _repository;

    public UpdateAssignment(IAssignmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Domain.Assignment> ExecuteAsync(UpdateAssignmentRequest request, Guid actorId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var assignment = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException($"Assignment '{request.Id}' was not found.");

        if (!isAdmin && assignment.TeacherId != actorId)
        {
            throw new BusinessRuleException(
                "Only the owning teacher can update this assignment.",
                StatusCodes.Status403Forbidden);
        }

        if (await _repository.ExistsByCourseAndTitleAsync(assignment.CourseId, request.Title.Trim(), assignment.Id, cancellationToken))
        {
            throw new BusinessRuleException(
                "An assignment with this title already exists in the course.",
                StatusCodes.Status409Conflict);
        }

        if (request.MaxMarks != assignment.MaxMarks
            && await _repository.HasGradedSubmissionsAsync(assignment.Id, cancellationToken))
        {
            throw new BusinessRuleException(
                "Maximum marks cannot be changed because graded submissions already exist.",
                StatusCodes.Status409Conflict);
        }

        request.ApplyTo(assignment);
        await _repository.UpdateAsync(assignment, cancellationToken);
        return assignment;
    }
}