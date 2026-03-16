using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using StudentRegistration.Domain.Entities;
using StudentRegistration.Domain.Interfaces;
using StudentRegistration.Infrastructure.Data;

namespace StudentRegistration.Infrastructure.Repositories;

public class StudentRepository : IStudentRepository
{
    private readonly AppDbContext _context;

    public StudentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<Student> Students, int TotalCount)> GetAllAsync(
        string? searchTerm,
        string? sortBy,
        string? sortOrder,
        int page,
        int pageSize)
    {
        IQueryable<Student> query = _context.Students;

        // --- Filtering / Searching ---
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(s =>
                s.StudentName.ToLower().Contains(term) ||
                s.Email.ToLower().Contains(term) ||
                s.MobileNo.Contains(term) ||
                (s.City != null && s.City.ToLower().Contains(term)) ||
                (s.State != null && s.State.ToLower().Contains(term)));
        }

        // --- Get total count before pagination ---
        int totalCount = await query.CountAsync();

        // --- Sorting ---
        var sortExpressions = new Dictionary<string, Expression<Func<Student, object>>>(StringComparer.OrdinalIgnoreCase)
        {
            ["studentName"] = s => s.StudentName,
            ["email"] = s => s.Email,
            ["mobileNo"] = s => s.MobileNo,
            ["city"] = s => s.City ?? string.Empty,
            ["state"] = s => s.State ?? string.Empty,
            ["studentId"] = s => s.StudentId
        };

        var isDescending = string.Equals(sortOrder, "desc", StringComparison.OrdinalIgnoreCase);
        if (!string.IsNullOrWhiteSpace(sortBy) && sortExpressions.TryGetValue(sortBy, out var sortExpression))
        {
            query = isDescending
                ? query.OrderByDescending(sortExpression)
                : query.OrderBy(sortExpression);
        }
        else
        {
            query = query.OrderBy(s => s.StudentId);
        }

        // --- Pagination ---
        var students = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return (students, totalCount);
    }

    public async Task<Student?> GetByIdAsync(int id)
    {
        return await _context.Students.FindAsync(id);
    }

    public async Task AddAsync(Student student)
    {
        await _context.Students.AddAsync(student);
    }

    public void Update(Student student)
    {
        _context.Students.Update(student);
    }

    public void Delete(Student student)
    {
        _context.Students.Remove(student);
    }
}
