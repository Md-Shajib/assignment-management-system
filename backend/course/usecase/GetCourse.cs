using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Course.Repositories;

namespace AssignmentManagement.Course.UseCases;

/// <summary>
/// Retrieves courses, either all or by id.
/// </summary>
public class GetCourse
{
    private readonly ICourseRepository _repository;

    public GetCourse(ICourseRepository repository)
    {
        _repository = repository;
    }

    public async Task<Domain.Course> ByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Course '{id}' was not found.");

    public async Task<IReadOnlyList<Domain.Course>> AllAsync(CancellationToken cancellationToken = default)
        => await _repository.GetAllAsync(cancellationToken);

    /// <summary>
    /// Returns courses currently assigned to the given teacher.
    /// </summary>
    public async Task<IReadOnlyList<Domain.Course>> ByTeacherAsync(Guid teacherId, CancellationToken cancellationToken = default)
    {
        var courses = await _repository.GetAllAsync(cancellationToken);
        return courses.Where(c => c.TeacherId == teacherId).ToList();
    }
}