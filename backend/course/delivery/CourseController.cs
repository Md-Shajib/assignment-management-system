using Microsoft.AspNetCore.Mvc;
using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Course.Delivery;

/// <summary>
/// Exposes course management operations over the REST API.
/// </summary>
[ApiController]
[Route("api/v1/courses")]
public class CourseController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll(CancellationToken cancellationToken)
    {
        // TODO: Implement listing of courses.
        return Ok(ApiResponse<object>.Ok(new { message = "Course listing is not implemented yet." }));
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetById(Guid id, CancellationToken cancellationToken)
    {
        // TODO: Implement retrieval of a single course.
        return Ok(ApiResponse<object>.Ok(new { id }));
    }

    [HttpPost]
    public IActionResult Create([FromBody] object request, CancellationToken cancellationToken)
    {
        // TODO: Implement course creation.
        return Ok(ApiResponse<object>.Ok(new { message = "Course creation is not implemented yet." }));
    }
}
