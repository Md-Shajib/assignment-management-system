using Microsoft.AspNetCore.Mvc;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Submission.Delivery;

/// <summary>
/// Exposes submission operations over the REST API.
/// </summary>
[ApiController]
[Route("api/v1/submissions")]
public class SubmissionController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll(Guid? assignmentId, CancellationToken cancellationToken)
    {
        // TODO: Implement listing of submissions (filtered by assignment / student).
        return Ok(ApiResponse<object>.Ok(new { message = "Submission listing is not implemented yet." }));
    }

    [HttpPost]
    public IActionResult Create([FromBody] object request, CancellationToken cancellationToken)
    {
        // TODO: Implement student submission creation.
        return Ok(ApiResponse<object>.Ok(new { message = "Submission creation is not implemented yet." }));
    }

    [HttpPatch("{id:guid}/review")]
    public IActionResult Review(Guid id, [FromBody] object request, CancellationToken cancellationToken)
    {
        // TODO: Implement teacher grading / review.
        return Ok(ApiResponse<object>.Ok(new { message = "Submission review is not implemented yet." }));
    }
}
