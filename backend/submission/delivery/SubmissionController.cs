using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FluentValidation.Results;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Student.UseCases;
using AssignmentManagement.Submission.Dtos;
using AssignmentManagement.Submission.UseCases;
using AssignmentManagement.Submission.Transformers;
using AssignmentManagement.Submission.Validators;
using AssignmentManagement.Shared.Constants;
using AssignmentManagement.Shared.Responses;
using AssignmentManagement.Shared.Utilities;

namespace AssignmentManagement.Submission.Delivery;

/// <summary>
/// Exposes submission operations over the REST API.
/// Students create/update their own submissions and view them; teachers review
/// submissions of their own assignments (Admin is read + grade).
/// </summary>
[ApiController]
[Route("api/v1/submissions")]
[Authorize]
public class SubmissionController : ControllerBase
{
    private readonly CreateSubmission _createSubmission;
    private readonly UpdateSubmission _updateSubmission;
    private readonly GradeSubmission _gradeSubmission;
    private readonly GetSubmission _getSubmission;
    private readonly GetAssignment _getAssignment;
    private readonly GetStudent _getStudent;
    private readonly SubmitValidator _submitValidator;
    private readonly GradeSubmissionValidator _gradeValidator;
    private readonly SubmissionResponseTransformer _responseTransformer;

    public SubmissionController(
        CreateSubmission createSubmission,
        UpdateSubmission updateSubmission,
        GradeSubmission gradeSubmission,
        GetSubmission getSubmission,
        GetAssignment getAssignment,
        GetStudent getStudent,
        SubmitValidator submitValidator,
        GradeSubmissionValidator gradeValidator,
        SubmissionResponseTransformer responseTransformer)
    {
        _createSubmission = createSubmission;
        _updateSubmission = updateSubmission;
        _gradeSubmission = gradeSubmission;
        _getSubmission = getSubmission;
        _getAssignment = getAssignment;
        _getStudent = getStudent;
        _submitValidator = submitValidator;
        _gradeValidator = gradeValidator;
        _responseTransformer = responseTransformer;
    }

    [HttpPost]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult<ApiResponse<SubmissionResponse>>> Create([FromBody] SubmitRequest request, CancellationToken cancellationToken)
    {
        var validation = await _submitValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        var submission = await _createSubmission.ExecuteAsync(request, User.RequireUserId(), cancellationToken);
        return Ok(ApiResponse<SubmissionResponse>.Ok(_responseTransformer.ToResponse(submission)));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult<ApiResponse<SubmissionResponse>>> Update(Guid id, [FromBody] SubmitRequest request, CancellationToken cancellationToken)
    {
        var validation = await _submitValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        var submission = await _updateSubmission.ExecuteAsync(id, request, User.RequireUserId(), cancellationToken);
        return Ok(ApiResponse<SubmissionResponse>.Ok(_responseTransformer.ToResponse(submission)));
    }

    [HttpPatch("{id:guid}/review")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
    public async Task<ActionResult<ApiResponse<SubmissionResponse>>> Review(Guid id, [FromBody] GradeSubmissionRequest request, CancellationToken cancellationToken)
    {
        var validation = await _gradeValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiErrorResponse.BadRequest("Validation failed.", ToFieldErrors(validation)));
        }

        var submission = await _gradeSubmission.ExecuteAsync(
            id, request, User.RequireUserId(), User.IsInRole(Roles.Admin), cancellationToken);
        return Ok(ApiResponse<SubmissionResponse>.Ok(_responseTransformer.ToResponse(submission)));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<SubmissionResponse>>>> GetAll(
        CancellationToken cancellationToken,
        [FromQuery] Guid? assignmentId,
        [FromQuery] int page = PaginationQuery.DefaultPage,
        [FromQuery] int pageSize = PaginationQuery.DefaultPageSize)
    {
        IReadOnlyList<Domain.Submission> submissions;

        if (User.IsInRole(Roles.Teacher))
        {
            if (!assignmentId.HasValue)
            {
                return Forbid();
            }

            var assignment = await _getAssignment.ByIdAsync(assignmentId.Value, cancellationToken);
            if (assignment.TeacherId != User.RequireUserId())
            {
                return Forbid();
            }

            submissions = await _getSubmission.ByAssignmentAsync(assignmentId.Value, cancellationToken);
        }
        else
        {
            submissions = assignmentId.HasValue
                ? await _getSubmission.ByAssignmentAsync(assignmentId.Value, cancellationToken)
                : await _getSubmission.AllAsync(cancellationToken);
        }

        var (items, meta) = PaginationQuery.Apply(submissions.Select(_responseTransformer.ToResponse), page, pageSize);
        return Ok(ApiResponse<IReadOnlyList<SubmissionResponse>>.Paged(items, meta));
    }

    [HttpGet("my")]
    [Authorize(Roles = Roles.Student)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<SubmissionResponse>>>> My(CancellationToken cancellationToken)
    {
        var student = await _getStudent.ByUserIdAsync(User.RequireUserId(), cancellationToken);
        var submissions = await _getSubmission.ByStudentAsync(student.Id, cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<SubmissionResponse>>.Ok(
            submissions.Select(_responseTransformer.ToResponse).ToList()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<SubmissionResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var submission = await _getSubmission.ByIdAsync(id, cancellationToken);
        var actorId = User.RequireUserId();

        if (User.IsInRole(Roles.Teacher))
        {
            var assignment = await _getAssignment.ByIdAsync(submission.AssignmentId, cancellationToken);
            if (assignment.TeacherId != actorId)
            {
                return Forbid();
            }
        }
        else if (User.IsInRole(Roles.Student))
        {
            var student = await _getStudent.ByUserIdAsync(actorId, cancellationToken);
            if (submission.StudentId != student.Id)
            {
                return Forbid();
            }
        }

        return Ok(ApiResponse<SubmissionResponse>.Ok(_responseTransformer.ToResponse(submission)));
    }

    private static List<FieldError> ToFieldErrors(ValidationResult result)
        => result.Errors
            .Select(e => new FieldError { Field = e.PropertyName, Message = e.ErrorMessage })
            .ToList();
}