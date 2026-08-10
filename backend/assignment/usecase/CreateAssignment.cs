using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Course.Repositories;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Assignment.Transformers;
using AssignmentManagement.Assignment.Dtos;

namespace AssignmentManagement.Assignment.UseCases;

/// <summary>
/// Creates a new assignment in <see cref="Shared.Constants.AssignmentStatus.Draft"/> state.
/// Only the teacher assigned to the target course (or an Admin) may create assignments for it.
/// </summary>
public class CreateAssignment
{
    private readonly IAssignmentRepository _repository;
    private readonly ICourseRepository _courseRepository;
    private readonly AssignmentRequestTransformer _transformer;

    public CreateAssignment(
        IAssignmentRepository repository,
        ICourseRepository courseRepository,
        AssignmentRequestTransformer transformer)
    {
        _repository = repository;
        _courseRepository = courseRepository;
        _transformer = transformer;
    }

    public async Task<Domain.Assignment> ExecuteAsync(CreateAssignmentRequest request, Guid actorId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var course = await _courseRepository.GetByIdAsync(request.CourseId, cancellationToken)
            ?? throw new NotFoundException($"Course '{request.CourseId}' was not found.");

        if (!isAdmin && course.TeacherId != actorId)
        {
            throw new BusinessRuleException(
                "You are not assigned to this course and cannot create assignments for it.",
                StatusCodes.Status403Forbidden);
        }

        if (await _repository.ExistsByCourseAndTitleAsync(request.CourseId, request.Title.Trim(), null, cancellationToken))
        {
            throw new BusinessRuleException(
                "An assignment with this title already exists in the course.",
                StatusCodes.Status409Conflict);
        }

        var ownerId = course.TeacherId ?? actorId;
        var assignment = _transformer.ToEntity(request, ownerId);
        await _repository.AddAsync(assignment, cancellationToken);
        return assignment;
    }
}