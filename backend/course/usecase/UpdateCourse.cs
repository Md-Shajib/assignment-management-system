using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Course.Repositories;
using AssignmentManagement.Course.Transformers;
using AssignmentManagement.Course.Dtos;

namespace AssignmentManagement.Course.UseCases;

/// <summary>
/// Updates an existing course (Admin only).
/// </summary>
public class UpdateCourse
{
    private readonly ICourseRepository _repository;
    private readonly CourseRequestTransformer _transformer;

    public UpdateCourse(ICourseRepository repository, CourseRequestTransformer transformer)
    {
        _repository = repository;
        _transformer = transformer;
    }

    public async Task<Domain.Course> ExecuteAsync(UpdateCourseRequest request, CancellationToken cancellationToken = default)
    {
        var course = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException($"Course '{request.Id}' was not found.");

        _transformer.ApplyTo(request, course);
        await _repository.UpdateAsync(course, cancellationToken);
        return course;
    }
}