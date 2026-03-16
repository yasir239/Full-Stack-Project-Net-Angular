using StudentRegistration.Domain.Entities;

namespace StudentRegistration.Domain.Interfaces;

public interface IStudentRepository
{
    Task<(IEnumerable<Student> Students, int TotalCount)> GetAllAsync(
        string? searchTerm,
        string? sortBy,
        string? sortOrder,
        int page,
        int pageSize);
    Task<Student?> GetByIdAsync(int id);
    Task AddAsync(Student student);
    void Update(Student student);
    void Delete(Student student);
}
