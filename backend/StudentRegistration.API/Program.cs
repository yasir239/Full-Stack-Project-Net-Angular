using FluentValidation;
using Microsoft.EntityFrameworkCore;
using StudentRegistration.API.Middleware;
using StudentRegistration.Application.Mappings;
using StudentRegistration.Application.Validators;
using StudentRegistration.Domain.Interfaces;
using StudentRegistration.Infrastructure;
using StudentRegistration.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// ----- Database -----
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite("Data Source=StudentRegistration.db"));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}

// ----- Dependency Injection -----
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ----- AutoMapper -----
builder.Services.AddAutoMapper(typeof(StudentMappingProfile));

// ----- FluentValidation -----
builder.Services.AddValidatorsFromAssemblyContaining<CreateStudentValidator>();

// ----- CORS -----
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "http://localhost:80",
                "http://frontend",
                "http://frontend:80")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ----- Controllers & Swagger -----
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Student Registration API",
        Version = "v1",
        Description = "An enterprise-grade Student Registration REST API built with ASP.NET Core 8, Repository Pattern, and Clean Architecture."
    });
});

var app = builder.Build();

// ----- Middleware Pipeline -----
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Student Registration API v1"));

app.UseCors("AllowAngularApp");
app.UseAuthorization();
app.MapControllers();

// ----- Auto-create database on startup -----
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();

