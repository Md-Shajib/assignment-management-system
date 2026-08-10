using AssignmentManagement.Shared.Exceptions;
using AssignmentManagement.Student.Repositories;
using AssignmentManagement.Course.Repositories;

namespace AssignmentManagement.Student.UseCases;

/// <summary>
/// Enrolls a student into a course (Admin only). Idempotent when already enrolled.
/// </summary>
public class EnrollStudentToCourse
{
    private readonly IStudentRepository _studentRepository;
    private readonly ICourseRepository _courseRepository;

    public EnrollStudentToCourse(IStudentRepository studentRepository, ICourseRepository courseRepository)
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

        if (course.IsDeleted)
        {
            throw new BusinessRuleException("Course has been deleted and cannot accept enrollments.");
        }

        if (student.CourseId == course.Id)
        {
            return;
        }

        student.CourseId = course.Id;
        await _studentRepository.UpdateAsync(student, cancellationToken);
    }
}