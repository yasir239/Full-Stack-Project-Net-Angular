using StudentRegistration.Domain.Interfaces;
using StudentRegistration.Infrastructure.Data;
using StudentRegistration.Infrastructure.Repositories;

namespace StudentRegistration.Infrastructure;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IStudentRepository? _students;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IStudentRepository Students => _students ??= new StudentRepository(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}
