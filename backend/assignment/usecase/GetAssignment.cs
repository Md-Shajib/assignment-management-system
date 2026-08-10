using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Assignment.Repositories;

namespace AssignmentManagement.Assignment.UseCases;

/// <summary>
/// Retrieves assignments with role-aware filters.
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

    /// <summary>
    /// Returns assignments owned by the given teacher, optionally narrowed to a course.
    /// </summary>
    public async Task<IReadOnlyList<Domain.Assignment>> ByTeacherAsync(Guid teacherId, Guid? courseId, CancellationToken cancellationToken = default)
    {
        var assignments = await _repository.GetByTeacherAsync(teacherId, cancellationToken);
        return courseId.HasValue
            ? assignments.Where(a => a.CourseId == courseId.Value).ToList()
            : assignments;
    }

    /// <summary>
    /// Returns currently published assignments for a course (visible to enrolled students).
    /// </summary>
    public async Task<IReadOnlyList<Domain.Assignment>> PublishedByCourseAsync(Guid courseId, CancellationToken cancellationToken = default)
    {
        var assignments = await _repository.GetByCourseAsync(courseId, cancellationToken);
        return assignments.Where(a => a.Status == AssignmentStatus.Published).ToList();
    }
}