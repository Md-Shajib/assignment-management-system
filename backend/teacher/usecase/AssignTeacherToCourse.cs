using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Teacher.Repositories;
using AssignmentManagement.Course.Repositories;

namespace AssignmentManagement.Teacher.UseCases;

/// <summary>
/// Assigns a teacher to a course (Admin only). Idempotent when already assigned.
/// </summary>
public class AssignTeacherToCourse
{
    private readonly ITeacherRepository _teacherRepository;
    private readonly ICourseRepository _courseRepository;

    public AssignTeacherToCourse(ITeacherRepository teacherRepository, ICourseRepository courseRepository)
    {
        _teacherRepository = teacherRepository;
        _courseRepository = courseRepository;
    }

    public async Task ExecuteAsync(Guid teacherId, Guid courseId, CancellationToken cancellationToken = default)
    {
        var teacher = await _teacherRepository.GetByIdAsync(teacherId, cancellationToken)
            ?? throw new NotFoundException($"Teacher '{teacherId}' was not found.");

        var course = await _courseRepository.GetByIdAsync(courseId, cancellationToken)
            ?? throw new NotFoundException($"Course '{courseId}' was not found.");

        if (course.TeacherId == teacher.Id)
        {
            return;
        }

        course.TeacherId = teacher.Id;
        course.UpdatedAt = DateTime.UtcNow;
        await _courseRepository.UpdateAsync(course, cancellationToken);
    }
}