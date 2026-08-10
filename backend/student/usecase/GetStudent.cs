using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Student.Repositories;

namespace AssignmentManagement.Student.UseCases;

/// <summary>
/// Retrieves student profiles.
/// </summary>
public class GetStudent
{
    private readonly IStudentRepository _repository;

    public GetStudent(IStudentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Domain.Student> ByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Student '{id}' was not found.");

    public async Task<Domain.Student> ByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => await _repository.GetByUserIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException($"Student profile for user '{userId}' was not found.");

    public async Task<IReadOnlyList<Domain.Student>> AllAsync(CancellationToken cancellationToken = default)
        => await _repository.GetAllAsync(cancellationToken);

    public async Task<IReadOnlyList<Domain.Student>> ByCourseAsync(Guid courseId, CancellationToken cancellationToken = default)
        => await _repository.GetByCourseAsync(courseId, cancellationToken);
}