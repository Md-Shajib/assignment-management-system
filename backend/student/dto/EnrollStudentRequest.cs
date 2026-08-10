namespace AssignmentManagement.Student.Dtos;

/// <summary>
/// Request payload used to enroll a student into (or unenroll from) a course.
/// </summary>
public class EnrollStudentRequest
{
    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }
}