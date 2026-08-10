using Microsoft.EntityFrameworkCore;
using AssignmentManagement.Domain;
using AssignmentManagement.Submission.Repositories;
using AssignmentManagement.Infrastructure.Database;

namespace AssignmentManagement.Infrastructure.Repositories;

/// <summary>
/// EF Core implementation of <see cref="ISubmissionRepository"/>.
/// </summary>
public class SubmissionRepository : ISubmissionRepository
{
    private readonly ApplicationDbContext _context;

    public SubmissionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Submission?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Submissions.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

    public async Task<Domain.Submission?> GetByAssignmentAndStudentAsync(Guid assignmentId, Guid studentId, CancellationToken cancellationToken = default)
        => await _context.Submissions
            .FirstOrDefaultAsync(s => s.AssignmentId == assignmentId && s.StudentId == studentId, cancellationToken);

    public async Task<IReadOnlyList<Domain.Submission>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Submissions
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Domain.Submission>> GetByAssignmentAsync(Guid assignmentId, CancellationToken cancellationToken = default)
        => await _context.Submissions
            .Where(s => s.AssignmentId == assignmentId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Domain.Submission>> GetByStudentAsync(Guid studentId, CancellationToken cancellationToken = default)
        => await _context.Submissions
            .Where(s => s.StudentId == studentId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Domain.Submission submission, CancellationToken cancellationToken = default)
    {
        _context.Submissions.Add(submission);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Domain.Submission submission, CancellationToken cancellationToken = default)
    {
        _context.Submissions.Update(submission);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
