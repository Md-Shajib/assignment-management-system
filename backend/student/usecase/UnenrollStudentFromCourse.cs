using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Student.Repositories;
using AssignmentManagement.Course.Repositories;

namespace AssignmentManagement.Student.UseCases;

/// <summary>
/// Unenrolls a student from a course (Admin only).
/// </summary>
public class UnenrollStudentFromCourse
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICourseRepository _courseRepository;

    public UnenrollStudentFromCourse(IStudentRepository studentRepository, ICourseRepository courseRepository)
    {
        _studentRepository = studentRepository;
        _courseRepository = courseRepository;
    }

    public async Task ExecuteAsync(Guid studentId, Guid courseId, CancellationToken cancellationToken = default)
    {
        var student = await _studentRepository.GetByIdAsync(studentId, cancellationToken)
            ?? throw new NotFoundException($"Student '{studentId}' was not found.");

        var course = await _courseRepository.GetByIdAsync(courseId, cancellationToken)
            ?? throw new NotFoundException($"Course '{courseId}' was not found.");

        if (student.CourseId != course.Id)
        {
            throw new BusinessRuleException($"Student '{studentId}' is not enrolled in course '{courseId}'.");
        }

        student.CourseId = null;
        await _studentRepository.UpdateAsync(student, cancellationToken);
    }
}