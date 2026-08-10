namespace AssignmentManagement.Shared.Responses;

/// <summary>
/// Pagination metadata attached to list responses, matching the standard API envelope.
/// </summary>
public class ApiMeta
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalRecords { get; set; }
    public int TotalPages { get; set; }

    /// <summary>
    /// Builds pagination metadata from the requested page/page size and the total record count.
    /// </summary>
    public static ApiMeta Compute(int page, int pageSize, int totalRecords)
    {
        var totalPages = pageSize <= 0 ? 1 : (int)Math.Ceiling(totalRecords / (double)pageSize);
        return new ApiMeta
        {
            Page = page,
            PageSize = pageSize,
            TotalRecords = totalRecords,
            TotalPages = totalPages
        };
    }
}