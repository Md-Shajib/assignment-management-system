using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Course.Repositories;

namespace AssignmentManagement.Course.UseCases;

/// <summary>
/// Soft-deletes a course (Admin only). Historical records are preserved.
/// </summary>
public class DeleteCourse
{
    private readonly ICourseRepository _repository;

    public DeleteCourse(ICourseRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var course = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Course '{id}' was not found.");

        await _repository.DeleteAsync(course, cancellationToken);
    }
}