using Microsoft.AspNetCore.Mvc;
using AssignmentManagement.Assignment.UseCases;
using AssignmentManagement.Assignment.Transformers;
using AssignmentManagement.Assignment.Dtos;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Assignment.Delivery;

/// <summary>
/// Exposes assignment CRUD operations over the REST API.
/// </summary>
[ApiController]
[Route("api/v1/assignments")]
public class AssignmentController : ControllerBase
{
    private readonly CreateAssignment _createAssignment;
    private readonly UpdateAssignment _updateAssignment;
    private readonly DeleteAssignment _deleteAssignment;
    private readonly GetAssignment _getAssignment;
    private readonly AssignmentResponseTransformer _responseTransformer;

    public AssignmentController(
        CreateAssignment createAssignment,
        UpdateAssignment updateAssignment,
        DeleteAssignment deleteAssignment,
        GetAssignment getAssignment,
        AssignmentResponseTransformer responseTransformer)
    {
        _createAssignment = createAssignment;
        _updateAssignment = updateAssignment;
        _deleteAssignment = deleteAssignment;
        _getAssignment = getAssignment;
        _responseTransformer = responseTransformer;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<AssignmentResponse>>>> GetAll([FromQuery] Guid? courseId, CancellationToken cancellationToken)
    {
        var assignments = await _getAssignment.AllAsync(courseId, cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<AssignmentResponse>>.Ok(
            assignments.Select(_responseTransformer.ToResponse).ToList()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<AssignmentResponse>>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var assignment = await _getAssignment.ByIdAsync(id, cancellationToken);
        return Ok(ApiResponse<AssignmentResponse>.Ok(_responseTransformer.ToResponse(assignment)));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<AssignmentResponse>>> Create([FromBody] CreateAssignmentRequest request, CancellationToken cancellationToken)
    {
        // TODO: Resolve the authenticated teacher's id from the JWT claims.
        var assignment = await _createAssignment.ExecuteAsync(request, Guid.Empty, cancellationToken);
        return Ok(ApiResponse<AssignmentResponse>.Ok(_responseTransformer.ToResponse(assignment)));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<AssignmentResponse>>> Update(Guid id, [FromBody] UpdateAssignmentRequest request, CancellationToken cancellationToken)
    {
        request.Id = id;
        var assignment = await _updateAssignment.ExecuteAsync(request, Guid.Empty, cancellationToken);
        return Ok(ApiResponse<AssignmentResponse>.Ok(_responseTransformer.ToResponse(assignment)));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _deleteAssignment.ExecuteAsync(id, Guid.Empty, cancellationToken);
        return NoContent();
    }
}
