using Microsoft.AspNetCore.Mvc;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Student.Delivery;

/// <summary>
/// Exposes student profile operations over the REST API.
/// </summary>
[ApiController]
[Route("api/v1/students")]
public class StudentController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll(CancellationToken cancellationToken)
    {
        // TODO: Implement listing of student profiles.
        return Ok(ApiResponse<object>.Ok(new { message = "Student listing is not implemented yet." }));
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id, CancellationToken cancellationToken)
    {
        // TODO: Implement retrieval of a single student profile.
        return Ok(ApiResponse<object>.Ok(new { id }));
    }
}
