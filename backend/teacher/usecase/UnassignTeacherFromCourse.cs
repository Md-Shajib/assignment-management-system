using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Course.Repositories;

namespace AssignmentManagement.Teacher.UseCases;

/// <summary>
/// Removes a teacher from a course (Admin only).
/// </summary>
public class UnassignTeacherFromCourse
{
    private readonly ICourseRepository _courseRepository;

    public UnassignTeacherFromCourse(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task ExecuteAsync(Guid teacherId, Guid courseId, CancellationToken cancellationToken = default)
    {
        var course = await _courseRepository.GetByIdAsync(courseId, cancellationToken)
            ?? throw new NotFoundException($"Course '{courseId}' was not found.");

        if (course.TeacherId != teacherId)
        {
            throw new BusinessRuleException($"Teacher '{teacherId}' is not assigned to course '{courseId}'.");
        }

        course.TeacherId = null;
        course.UpdatedAt = DateTime.UtcNow;
        await _courseRepository.UpdateAsync(course, cancellationToken);
    }
}