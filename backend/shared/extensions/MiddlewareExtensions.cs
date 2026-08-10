using Microsoft.AspNetCore.Builder;
using AssignmentManagement.Shared.Middleware;

namespace AssignmentManagement.Shared.Extensions;

/// <summary>
/// Extensions that configure the application request pipeline.
/// </summary>
public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseExceptionHandling(this IApplicationBuilder app)
        => app.UseMiddleware<ExceptionHandlingMiddleware>();
}
