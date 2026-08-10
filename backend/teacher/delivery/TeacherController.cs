using Microsoft.AspNetCore.Mvc;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Teacher.Delivery;

/// <summary>
/// Exposes teacher profile operations over the REST API.
/// </summary>
[ApiController]
[Route("api/v1/teachers")]
public class TeacherController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll(CancellationToken cancellationToken)
    {
        // TODO: Implement listing of teacher profiles.
        return Ok(ApiResponse<object>.Ok(new { message = "Teacher listing is not implemented yet." }));
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id, CancellationToken cancellationToken)
    {
        // TODO: Implement retrieval of a single teacher profile.
        return Ok(ApiResponse<object>.Ok(new { id }));
    }
}
