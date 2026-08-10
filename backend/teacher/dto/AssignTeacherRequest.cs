namespace AssignmentManagement.Teacher.Dtos;

/// <summary>
/// Request payload used to (un)assign a teacher to/from a course.
/// </summary>
public class AssignTeacherRequest
{
    public Guid TeacherId { get; set; }
    public Guid CourseId { get; set; }
}