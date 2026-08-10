using Microsoft.EntityFrameworkCore;
using AssignmentManagement.Domain;
using AssignmentManagement.Assignment.Repositories;
using AssignmentManagement.Infrastructure.Database;
using AssignmentManagement.Shared.Constants;

namespace AssignmentManagement.Infrastructure.Repositories;

/// <summary>
/// EF Core implementation of <see cref="IAssignmentRepository"/>.
/// </summary>
public class AssignmentRepository : IAssignmentRepository
{
    private readonly ApplicationDbContext _context;

    public AssignmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Assignment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Assignments.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Domain.Assignment>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Assignments
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Domain.Assignment>> GetByCourseAsync(Guid courseId, CancellationToken cancellationToken = default)
        => await _context.Assignments
            .Where(a => a.CourseId == courseId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Domain.Assignment>> GetByTeacherAsync(Guid teacherId, CancellationToken cancellationToken = default)
        => await _context.Assignments
            .Where(a => a.TeacherId == teacherId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<bool> ExistsByCourseAndTitleAsync(Guid courseId, string title, Guid? excludeId = null, CancellationToken cancellationToken = default)
        => await _context.Assignments
            .AnyAsync(a => a.CourseId == courseId
                && a.Title == title
                && (!excludeId.HasValue || a.Id != excludeId.Value), cancellationToken);

    public async Task<bool> HasGradedSubmissionsAsync(Guid assignmentId, CancellationToken cancellationToken = default)
        => await _context.Submissions
            .AnyAsync(s => s.AssignmentId == assignmentId && s.Status == SubmissionStatus.Graded, cancellationToken);

    public async Task AddAsync(Domain.Assignment assignment, CancellationToken cancellationToken = default)
    {
        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Domain.Assignment assignment, CancellationToken cancellationToken = default)
    {
        _context.Assignments.Update(assignment);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Domain.Assignment assignment, CancellationToken cancellationToken = default)
    {
        assignment.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
