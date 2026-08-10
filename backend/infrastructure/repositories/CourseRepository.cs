using Microsoft.EntityFrameworkCore;
using AssignmentManagement.Domain;
using AssignmentManagement.Course.Repositories;
using AssignmentManagement.Infrastructure.Database;

namespace AssignmentManagement.Infrastructure.Repositories;

/// <summary>
/// EF Core implementation of <see cref="ICourseRepository"/>.
/// </summary>
public class CourseRepository : ICourseRepository
{
    private readonly ApplicationDbContext _context;

    public CourseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Course?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Courses.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Domain.Course>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Courses.AsNoTracking().ToListAsync(cancellationToken);

    public async Task AddAsync(Domain.Course course, CancellationToken cancellationToken = default)
    {
        _context.Courses.Add(course);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Domain.Course course, CancellationToken cancellationToken = default)
    {
        _context.Courses.Update(course);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Domain.Course course, CancellationToken cancellationToken = default)
    {
        course.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
