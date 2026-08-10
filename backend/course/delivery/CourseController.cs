using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation.Results;
using AssignmentManagement.Course.Dtos;
using AssignmentManagement.Course.UseCases;
using AssignmentManagement.Course.Transformers;
using AssignmentManagement.Course.Validators;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Course.Delivery;

/// <summary>
/// Exposes course management operations over the REST API.
/// Writes are Admin-only; reads are available to any authenticated user.
/// </summary>
[ApiController]
[Route("api/v1/courses")]
[Authorize]
public class CourseController : ControllerBase
{
    private readonly CreateCourse _createCourse;
    private readonly UpdateCourse _updateCourse;
    private readonly DeleteCourse _deleteCourse;
    private readonly GetCourse _getCourse;
    private readonly CreateCourseValidator _createValidator;
    private readonly UpdateCourseValidator _updateValidator;
    private readonly CourseResponseTransformer _responseTransformer;

    public CourseController(
        CreateCourse createCourse,
        UpdateCourse updateCourse,
        DeleteCourse deleteCourse,
        GetCourse getCourse,
        CreateCourseValidator createValidator,
        UpdateCourseValidator updateValidator,
        CourseResponseTransformer responseTransformer)
    {
        _createCourse = createCourse;
        _updateCourse = updateCourse;
        _deleteCourse = deleteCourse;
        _getCourse = getCourse;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _responseTransformer = responseTransformer;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CourseResponse>>>> GetAll(CancellationToken cancellationToken)
    {
        var courses = await _getCourse.AllAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<CourseResponse>>.Ok(
            courses.Select(_responseTransformer.ToResponse).ToList()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<CourseResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var course = await _getCourse.ByIdAsync(id, cancellationToken);
        return Ok(ApiResponse<CourseResponse>.Ok(_responseTransformer.ToResponse(course)));
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ApiResponse<CourseResponse>>> Create([FromBody] CreateCourseRequest request, CancellationToken cancellationToken)
    {
        var validation = await _createValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        var course = await _createCourse.ExecuteAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = course.Id },
            ApiResponse<CourseResponse>.Ok(_responseTransformer.ToResponse(course), "Course created successfully."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ApiResponse<CourseResponse>>> Update(Guid id, [FromBody] UpdateCourseRequest request, CancellationToken cancellationToken)
    {
        request.Id = id;
        var validation = await _updateValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        var course = await _updateCourse.ExecuteAsync(request, cancellationToken);
        return Ok(ApiResponse<CourseResponse>.Ok(_responseTransformer.ToResponse(course), "Course updated successfully."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _deleteCourse.ExecuteAsync(id, cancellationToken);
        return NoContent();
    }

    private static List<FieldError> ToFieldErrors(ValidationResult result)
        => result.Errors
            .Select(e => new FieldError { Field = e.PropertyName, Message = e.ErrorMessage })
            .ToList();
}