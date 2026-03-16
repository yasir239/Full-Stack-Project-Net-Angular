using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using StudentRegistration.Application.Common;
using StudentRegistration.Application.DTOs;
using StudentRegistration.Domain.Entities;
using StudentRegistration.Domain.Interfaces;

namespace StudentRegistration.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateStudentDto> _createValidator;
    private readonly IValidator<UpdateStudentDto> _updateValidator;

    public StudentsController(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IValidator<CreateStudentDto> createValidator,
        IValidator<UpdateStudentDto> updateValidator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    /// <summary>
    /// Gets a paginated, sortable, and searchable list of students.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<StudentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<StudentDto>>> GetAll(
        [FromQuery] StudentQueryParameters queryParams)
    {
        var (students, totalCount) = await _unitOfWork.Students.GetAllAsync(
            queryParams.Search,
            queryParams.SortBy,
            queryParams.SortOrder,
            queryParams.Page,
            queryParams.PageSize);

        var studentDtos = _mapper.Map<IEnumerable<StudentDto>>(students);

        var pagedResult = new PagedResult<StudentDto>
        {
            Items = studentDtos,
            TotalCount = totalCount,
            Page = queryParams.Page,
            PageSize = queryParams.PageSize
        };

        return Ok(pagedResult);
    }

    /// <summary>
    /// Gets a single student by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(StudentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StudentDto>> GetById(int id)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(id);
        if (student is null)
            return NotFound(new ProblemDetails
            {
                Title = "Student Not Found",
                Detail = $"No student found with ID {id}.",
                Status = StatusCodes.Status404NotFound
            });

        return Ok(_mapper.Map<StudentDto>(student));
    }

    /// <summary>
    /// Creates a new student.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(StudentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<StudentDto>> Create([FromBody] CreateStudentDto dto)
    {
        var validationResult = await _createValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return ValidationProblem(new ValidationProblemDetails(errors)
            {
                Title = "Validation Failed",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var student = _mapper.Map<Student>(dto);
        await _unitOfWork.Students.AddAsync(student);
        await _unitOfWork.SaveChangesAsync();

        var studentDto = _mapper.Map<StudentDto>(student);
        return CreatedAtAction(nameof(GetById), new { id = studentDto.StudentId }, studentDto);
    }

    /// <summary>
    /// Updates an existing student.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(StudentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StudentDto>> Update(int id, [FromBody] UpdateStudentDto dto)
    {
        var validationResult = await _updateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return ValidationProblem(new ValidationProblemDetails(errors)
            {
                Title = "Validation Failed",
                Status = StatusCodes.Status400BadRequest
            });
        }

        var student = await _unitOfWork.Students.GetByIdAsync(id);
        if (student is null)
            return NotFound(new ProblemDetails
            {
                Title = "Student Not Found",
                Detail = $"No student found with ID {id}.",
                Status = StatusCodes.Status404NotFound
            });

        _mapper.Map(dto, student);
        _unitOfWork.Students.Update(student);
        await _unitOfWork.SaveChangesAsync();

        return Ok(_mapper.Map<StudentDto>(student));
    }

    /// <summary>
    /// Deletes a student by ID.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(id);
        if (student is null)
            return NotFound(new ProblemDetails
            {
                Title = "Student Not Found",
                Detail = $"No student found with ID {id}.",
                Status = StatusCodes.Status404NotFound
            });

        _unitOfWork.Students.Delete(student);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }
}
