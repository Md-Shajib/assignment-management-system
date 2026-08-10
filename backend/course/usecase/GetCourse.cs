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
}