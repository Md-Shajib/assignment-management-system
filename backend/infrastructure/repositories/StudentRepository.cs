using Microsoft.EntityFrameworkCore;
using AssignmentManagement.Domain;
using AssignmentManagement.Student.Repositories;
using AssignmentManagement.Infrastructure.Database;

namespace AssignmentManagement.Infrastructure.Repositories;

/// <summary>
/// EF Core implementation of <see cref="IStudentRepository"/>.
/// </summary>
public class StudentRepository : IStudentRepository
{
    private readonly ApplicationDbContext _context;

    public StudentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Domain.Student?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Students.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

    public async Task<Domain.Student?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);

    public async Task<IReadOnlyList<Domain.Student>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _context.Students.AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Domain.Student>> GetByCourseAsync(Guid courseId, CancellationToken cancellationToken = default)
        => await _context.Students
            .Where(s => s.CourseId == courseId)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Domain.Student student, CancellationToken cancellationToken = default)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Domain.Student student, CancellationToken cancellationToken = default)
    {
        _context.Students.Update(student);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
