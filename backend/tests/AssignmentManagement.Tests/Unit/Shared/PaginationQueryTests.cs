using Xunit;
using FluentAssertions;
using AssignmentManagement.Shared.Utilities;

namespace AssignmentManagement.Tests.Unit.Shared;

public class PaginationQueryTests
{
    [Fact]
    public void Apply_ReturnsPageAndMeta()
    {
        var source = Enumerable.Range(1, 25).ToList();

        var (items, meta) = PaginationQuery.Apply(source, page: 3, pageSize: 10);

        items.Should().HaveCount(5);
        meta.Page.Should().Be(3);
        meta.PageSize.Should().Be(10);
        meta.TotalRecords.Should().Be(25);
        meta.TotalPages.Should().Be(3);
    }

    [Fact]
    public void Apply_NegativeOrZeroPage_IsClamped()
    {
        var source = Enumerable.Range(1, 5).ToList();

        var (items, meta) = PaginationQuery.Apply(source, page: 0, pageSize: 0);

        items.Should().HaveCount(5);
        meta.Page.Should().Be(1);
        meta.PageSize.Should().Be(PaginationQuery.DefaultPageSize);
        meta.TotalPages.Should().Be(1);
    }

    [Fact]
    public void Apply_OverSizedPageSize_IsClampedToMaximum()
    {
        var source = Enumerable.Range(1, 250).ToList();

        var (_, meta) = PaginationQuery.Apply(source, page: 1, pageSize: PaginationQuery.MaxPageSize + 100);

        meta.PageSize.Should().Be(PaginationQuery.MaxPageSize);
        meta.TotalPages.Should().Be(3);
    }

    [Fact]
    public void Apply_EmptySource_ReturnsEmptyPage()
    {
        var (items, meta) = PaginationQuery.Apply(Array.Empty<int>(), page: 1, pageSize: 10);

        items.Should().BeEmpty();
        meta.TotalRecords.Should().Be(0);
        meta.TotalPages.Should().Be(0);
    }
}