using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation.Results;
using AssignmentManagement.Course.Dtos;
using AssignmentManagement.Course.Transformers;
using AssignmentManagement.Course.UseCases;
using AssignmentManagement.Teacher.Dtos;
using AssignmentManagement.Teacher.UseCases;
using AssignmentManagement.Teacher.Transformers;
using AssignmentManagement.Teacher.Validators;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Teacher.Delivery;

/// <summary>
/// Exposes teacher profile and course-assignment operations over the REST API.
/// Reads are available to any authenticated user; assignments are Admin-only.
/// </summary>
[ApiController]
[Route("api/v1/teachers")]
[Authorize]
public class TeacherController : ControllerBase
{
    private readonly GetTeacher _getTeacher;
    private readonly AssignTeacherToCourse _assignTeacherToCourse;
    private readonly UnassignTeacherFromCourse _unassignTeacherFromCourse;
    private readonly GetCourse _getCourse;
    private readonly AssignTeacherValidator _assignValidator;
    private readonly TeacherResponseTransformer _teacherTransformer;
    private readonly CourseResponseTransformer _courseTransformer;

    public TeacherController(
        GetTeacher getTeacher,
        AssignTeacherToCourse assignTeacherToCourse,
        UnassignTeacherFromCourse unassignTeacherFromCourse,
        GetCourse getCourse,
        AssignTeacherValidator assignValidator,
        TeacherResponseTransformer teacherTransformer,
        CourseResponseTransformer courseTransformer)
    {
        _getTeacher = getTeacher;
        _assignTeacherToCourse = assignTeacherToCourse;
        _unassignTeacherFromCourse = unassignTeacherFromCourse;
        _getCourse = getCourse;
        _assignValidator = assignValidator;
        _teacherTransformer = teacherTransformer;
        _courseTransformer = courseTransformer;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<TeacherResponse>>>> GetAll(CancellationToken cancellationToken)
    {
        var teachers = await _getTeacher.AllAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<TeacherResponse>>.Ok(
            teachers.Select(_teacherTransformer.ToResponse).ToList()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<TeacherResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var teacher = await _getTeacher.ByIdAsync(id, cancellationToken);
        return Ok(ApiResponse<TeacherResponse>.Ok(_teacherTransformer.ToResponse(teacher)));
    }

    [HttpGet("{id:guid}/courses")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CourseResponse>>>> GetTeacherCourses(Guid id, CancellationToken cancellationToken)
    {
        var teacher = await _getTeacher.ByIdAsync(id, cancellationToken);
        var courses = await _getCourse.ByTeacherAsync(teacher.Id, cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<CourseResponse>>.Ok(
            courses.Select(_courseTransformer.ToResponse).ToList()));
    }

    [HttpPatch("{id:guid}/courses/{courseId:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Assign(Guid id, Guid courseId, CancellationToken cancellationToken)
    {
        var validation = await _assignValidator.ValidateAsync(new AssignTeacherRequest { TeacherId = id, CourseId = courseId }, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        await _assignTeacherToCourse.ExecuteAsync(id, courseId, cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { teacherId = id, courseId }, "Teacher assigned to course successfully."));
    }

    [HttpDelete("{id:guid}/courses/{courseId:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Unassign(Guid id, Guid courseId, CancellationToken cancellationToken)
    {
        var validation = await _assignValidator.ValidateAsync(new AssignTeacherRequest { TeacherId = id, CourseId = courseId }, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        await _unassignTeacherFromCourse.ExecuteAsync(id, courseId, cancellationToken);
        return Ok(ApiResponse<object>.Ok(new { teacherId = id, courseId }, "Teacher removed from course successfully."));
    }

    private static List<FieldError> ToFieldErrors(ValidationResult result)
        => result.Errors
            .Select(e => new FieldError { Field = e.PropertyName, Message = e.ErrorMessage })
            .ToList();
}