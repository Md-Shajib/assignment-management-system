using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation.Results;
using AssignmentManagement.Assignment.Dtos;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Assignment.Transformers;
using AssignmentManagement.Assignment.Validators;
using AssignmentManagement.Student.UseCases;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Responses;
using AssignmentManagement.Shared.Utilities;

namespace AssignmentManagement.Assignment.Delivery;

/// <summary>
/// Exposes assignment CRUD operations over the REST API.
/// Reads: all authenticated; writes: owning teacher or Admin.
/// Students only see published assignments for their enrolled course.
/// </summary>
[ApiController]
[Route("api/v1/assignments")]
[Authorize]
public class AssignmentController : ControllerBase
{
    private readonly CreateAssignment _createAssignment;
    private readonly UpdateAssignment _updateAssignment;
    private readonly DeleteAssignment _deleteAssignment;
    private readonly GetAssignment _getAssignment;
    private readonly PublishAssignment _publishAssignment;
    private readonly CloseAssignment _closeAssignment;
    private readonly GetStudent _getStudent;
    private readonly CreateAssignmentValidator _createValidator;
    private readonly UpdateAssignmentValidator _updateValidator;
    private readonly AssignmentResponseTransformer _responseTransformer;

    public AssignmentController(
        CreateAssignment createAssignment,
        UpdateAssignment updateAssignment,
        DeleteAssignment deleteAssignment,
        GetAssignment getAssignment,
        PublishAssignment publishAssignment,
        CloseAssignment closeAssignment,
        GetStudent getStudent,
        CreateAssignmentValidator createValidator,
        UpdateAssignmentValidator updateValidator,
        AssignmentResponseTransformer responseTransformer)
    {
        _createAssignment = createAssignment;
        _updateAssignment = updateAssignment;
        _deleteAssignment = deleteAssignment;
        _getAssignment = getAssignment;
        _publishAssignment = publishAssignment;
        _closeAssignment = closeAssignment;
        _getStudent = getStudent;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _responseTransformer = responseTransformer;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<AssignmentResponse>>>> GetAll(
        CancellationToken cancellationToken,
        [FromQuery] Guid? courseId,
        [FromQuery] int page = PaginationQuery.DefaultPage,
        [FromQuery] int pageSize = PaginationQuery.DefaultPageSize)
    {
        IReadOnlyList<Domain.Assignment> assignments;

        if (User.IsInRole(Roles.Student))
        {
            var student = await _getStudent.ByUserIdAsync(User.RequireUserId(), cancellationToken);
            assignments = student.CourseId.HasValue
                ? await _getAssignment.PublishedByCourseAsync(student.CourseId.Value, cancellationToken)
                : Array.Empty<Domain.Assignment>();
        }
        else if (User.IsInRole(Roles.Teacher))
        {
            assignments = await _getAssignment.ByTeacherAsync(User.RequireUserId(), courseId, cancellationToken);
        }
        else
        {
            assignments = await _getAssignment.AllAsync(courseId, cancellationToken);
        }

        var (items, meta) = PaginationQuery.Apply(assignments.Select(_responseTransformer.ToResponse), page, pageSize);
        return Ok(ApiResponse<IReadOnlyList<AssignmentResponse>>.Paged(items, meta));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<AssignmentResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var assignment = await _getAssignment.ByIdAsync(id, cancellationToken);

        if (User.IsInRole(Roles.Student))
        {
            var student = await _getStudent.ByUserIdAsync(User.RequireUserId(), cancellationToken);
            if (assignment.Status != AssignmentStatus.Published
                || !student.CourseId.HasValue
                || assignment.CourseId != student.CourseId.Value)
            {
                return Forbid();
            }
        }
        else if (User.IsInRole(Roles.Teacher) && assignment.TeacherId != User.RequireUserId())
        {
            return Forbid();
        }

        return Ok(ApiResponse<AssignmentResponse>.Ok(_responseTransformer.ToResponse(assignment)));
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
    public async Task<ActionResult<ApiResponse<AssignmentResponse>>> Create([FromBody] CreateAssignmentRequest request, CancellationToken cancellationToken)
    {
        var validation = await _createValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        var assignment = await _createAssignment.ExecuteAsync(
            request, User.RequireUserId(), User.IsInRole(Roles.Admin), cancellationToken);
        return Ok(ApiResponse<AssignmentResponse>.Ok(_responseTransformer.ToResponse(assignment)));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
    public async Task<ActionResult<ApiResponse<AssignmentResponse>>> Update(Guid id, [FromBody] UpdateAssignmentRequest request, CancellationToken cancellationToken)
    {
        request.Id = id;
        var validation = await _updateValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        var assignment = await _updateAssignment.ExecuteAsync(
            request, User.RequireUserId(), User.IsInRole(Roles.Admin), cancellationToken);
        return Ok(ApiResponse<AssignmentResponse>.Ok(_responseTransformer.ToResponse(assignment)));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _deleteAssignment.ExecuteAsync(id, User.RequireUserId(), User.IsInRole(Roles.Admin), cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:guid}/publish")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
    public async Task<ActionResult<ApiResponse<AssignmentResponse>>> Publish(Guid id, CancellationToken cancellationToken)
    {
        var assignment = await _publishAssignment.ExecuteAsync(
            id, User.RequireUserId(), User.IsInRole(Roles.Admin), cancellationToken);
        return Ok(ApiResponse<AssignmentResponse>.Ok(_responseTransformer.ToResponse(assignment)));
    }

    [HttpPatch("{id:guid}/close")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
    public async Task<ActionResult<ApiResponse<AssignmentResponse>>> Close(Guid id, CancellationToken cancellationToken)
    {
        var assignment = await _closeAssignment.ExecuteAsync(
            id, User.RequireUserId(), User.IsInRole(Roles.Admin), cancellationToken);
        return Ok(ApiResponse<AssignmentResponse>.Ok(_responseTransformer.ToResponse(assignment)));
    }

    private static List<FieldError> ToFieldErrors(ValidationResult result)
        => result.Errors
            .Select(e => new FieldError { Field = e.PropertyName, Message = e.ErrorMessage })
            .ToList();
}