using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Teacher.Repositories;

namespace AssignmentManagement.Teacher.UseCases;

/// <summary>
/// Retrieves teacher profiles.
/// </summary>
public class GetTeacher
{
    private readonly ITeacherRepository _repository;

    public GetTeacher(ITeacherRepository repository)
    {
        _repository = repository;
    }

    public async Task<Domain.Teacher> ByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Teacher '{id}' was not found.");

    public async Task<Domain.Teacher> ByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => await _repository.GetByUserIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException($"Teacher profile for user '{userId}' was not found.");

    public async Task<IReadOnlyList<Domain.Teacher>> AllAsync(CancellationToken cancellationToken = default)
        => await _repository.GetAllAsync(cancellationToken);
}