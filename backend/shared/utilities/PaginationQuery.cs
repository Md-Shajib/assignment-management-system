using AssignmentManagement.Shared.Responses;

namespace AssignmentManagement.Shared.Utilities;

/// <summary>
/// Normalizes and applies pagination to in-memory collections.
/// Consumes the standard `page` / `pageSize` query parameters.
/// </summary>
public static class PaginationQuery
{
    public const int DefaultPage = 1;
    public const int DefaultPageSize = 10;
    public const int MaxPageSize = 100;

    /// <summary>
    /// Clamps the requested page/page size to valid ranges and returns a page of results
    /// together with the pagination metadata for the full collection.
    /// </summary>
    public static (IReadOnlyList<T> Items, ApiMeta Meta) Apply<T>(IEnumerable<T> source, int page, int pageSize)
    {
        var items = source.ToList();
        var safePage = Math.Max(page, DefaultPage);
        var safePageSize = Math.Clamp(pageSize <= 0 ? DefaultPageSize : pageSize, 1, MaxPageSize);

        var paged = items
            .Skip((safePage - 1) * safePageSize)
            .Take(safePageSize)
            .ToList();

        var meta = ApiMeta.Compute(safePage, safePageSize, items.Count);
        return (paged, meta);
    }
}