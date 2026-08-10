namespace AssignmentManagement.Submission.Dtos;

/// <summary>
/// Request payload used by a teacher to grade a submission.
/// </summary>
public class GradeSubmissionRequest
{
    public decimal ObtainedMarks { get; set; }
    public string? TeacherFeedback { get; set; }
}