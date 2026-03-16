using Microsoft.EntityFrameworkCore;
using StudentRegistration.Domain.Entities;

namespace StudentRegistration.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Student> Students => Set<Student>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId);
            entity.Property(e => e.StudentId).ValueGeneratedOnAdd();
            entity.Property(e => e.StudentName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.MobileNo).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.State).HasMaxLength(50);
            entity.Property(e => e.PinCode).HasMaxLength(10);
            entity.Property(e => e.AddressLine1).HasMaxLength(200);
            entity.Property(e => e.AddressLine2).HasMaxLength(200);
        });
    }
}
