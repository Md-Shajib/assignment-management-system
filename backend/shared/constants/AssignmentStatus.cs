namespace AssignmentManagement.Shared.Constants;

/// <summary>
/// Possible lifecycle states of an <see cref="AssignmentManagement.Domain.Assignment"/>.
/// </summary>
public static class AssignmentStatus
{
    public const string Draft = "Draft";
    public const string Published = "Published";
    public const string Closed = "Closed";
}
