using AssignmentManagement.Course.Repositories;
using AssignmentManagement.Course.Transformers;
using AssignmentManagement.Course.Dtos;

namespace AssignmentManagement.Course.UseCases;

/// <summary>
/// Creates a new course (Admin only).
/// </summary>
public class CreateCourse
{
    private readonly ICourseRepository _repository;
    private readonly CourseRequestTransformer _transformer;

    public CreateCourse(ICourseRepository repository, CourseRequestTransformer transformer)
    {
        _repository = repository;
        _transformer = transformer;
    }

    public async Task<Domain.Course> ExecuteAsync(CreateCourseRequest request, CancellationToken cancellationToken = default)
    {
        var course = _transformer.ToEntity(request);
        await _repository.AddAsync(course, cancellationToken);
        return course;
    }
}