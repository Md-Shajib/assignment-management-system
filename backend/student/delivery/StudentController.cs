using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation.Results;
using AssignmentManagement.Course.Dtos;
using AssignmentManagement.Course.Transformers;
using AssignmentManagement.Course.UseCases;
using AssignmentManagement.Student.Dtos;
using AssignmentManagement.Student.UseCases;
using AssignmentManagement.Student.Transformers;
using AssignmentManagement.Student.Validators;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Student.Delivery;

/// <summary>
/// Exposes student profile and course-enrollment operations over the REST API.
/// Reads are available to any authenticated user; enrollments are Admin-only.
/// </summary>
[ApiController]
[Route("api/v1/students")]
[Authorize]
public class StudentController : ControllerBase
{
    private readonly GetStudent _getStudent;
    private readonly EnrollStudentToCourse _enrollStudentToCourse;
    private readonly UnenrollStudentFromCourse _unenrollStudentFromCourse;
    private readonly GetCourse _getCourse;
    private readonly EnrollStudentValidator _enrollValidator;
    private readonly StudentResponseTransformer _studentTransformer;
    private readonly CourseResponseTransformer _courseTransformer;

    public StudentController(
        GetStudent getStudent,
        EnrollStudentToCourse enrollStudentToCourse,
        UnenrollStudentFromCourse unenrollStudentFromCourse,
        GetCourse getCourse,
        EnrollStudentValidator enrollValidator,
        StudentResponseTransformer studentTransformer,
        CourseResponseTransformer courseTransformer)
    {
        _getStudent = getStudent;
        _enrollStudentToCourse = enrollStudentToCourse;
        _unenrollStudentFromCourse = unenrollStudentFromCourse;
        _getCourse = getCourse;
        _enrollValidator = enrollValidator;
        _studentTransformer = studentTransformer;
        _courseTransformer = courseTransformer;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<StudentResponse>>>> GetAll(CancellationToken cancellationToken)
    {
        var students = await _getStudent.AllAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<StudentResponse>>.Ok(
            students.Select(_studentTransformer.ToResponse).ToList()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<StudentResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var student = await _getStudent.ByIdAsync(id, cancellationToken);
        return Ok(ApiResponse<StudentResponse>.Ok(_studentTransformer.ToResponse(student)));
    }

    [HttpGet("{id:guid}/course")]
    public async Task<ActionResult<ApiResponse<CourseResponse?>>> GetEnrolledCourse(Guid id, CancellationToken cancellationToken)
    {
        var student = await _getStudent.ByIdAsync(id, cancellationToken);

        if (!student.CourseId.HasValue)
        {
            return Ok(ApiResponse<CourseResponse?>.Ok(null, "Student is not enrolled in any course."));
        }

        var course = await _getCourse.ByIdAsync(student.CourseId.Value, cancellationToken);
        return Ok(ApiResponse<CourseResponse?>.Ok(_courseTransformer.ToResponse(course)));
    }

    [HttpPatch("{id:guid}/courses/{courseId:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Enroll(Guid id, Guid courseId, CancellationToken cancellationToken)
    {
        var validation = await _enrollValidator.ValidateAsync(new EnrollStudentRequest { StudentId = id, CourseId = courseId }, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        await _enrollStudentToCourse.ExecuteAsync(id, courseId, cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { studentId = id, courseId }, "Student enrolled in course successfully."));
    }

    [HttpDelete("{id:guid}/courses/{courseId:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Unenroll(Guid id, Guid courseId, CancellationToken cancellationToken)
    {
        var validation = await _enrollValidator.ValidateAsync(new EnrollStudentRequest { StudentId = id, CourseId = courseId }, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        await _unenrollStudentFromCourse.ExecuteAsync(id, courseId, cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { studentId = id, courseId }, "Student removed from course successfully."));
    }

    private static List<FieldError> ToFieldErrors(ValidationResult result)
        => result.Errors
            .Select(e => new FieldError { Field = e.PropertyName, Message = e.ErrorMessage })
            .ToList();
}