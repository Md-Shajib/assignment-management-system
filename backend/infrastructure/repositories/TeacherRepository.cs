using Microsoft.EntityFrameworkCore;
using AssignmentManagement.Domain;
using AssignmentManagement.Teacher.Repositories;
using AssignmentManagement.Infrastructure.Database;

namespace AssignmentManagement.Infrastructure.Repositories;

/// <summary>
/// EF Core implementation of <see cref="ITeacherRepository"/>.
/// </summary>
public class TeacherRepository : ITeacherRepository
{
    private readonly ApplicationDbContext _context;

    public TeacherRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Teacher?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Teachers.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

    public async Task<Domain.Teacher?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => await _context.Teachers.FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

    public async Task<IReadOnlyList<Domain.Teacher>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Teachers.AsNoTracking().ToListAsync(cancellationToken);

    public async Task AddAsync(Domain.Teacher teacher, CancellationToken cancellationToken = default)
    {
        _context.Teachers.Add(teacher);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Domain.Teacher teacher, CancellationToken cancellationToken = default)
    {
        _context.Teachers.Update(teacher);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
