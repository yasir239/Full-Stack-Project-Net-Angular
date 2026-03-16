using AutoMapper;
using StudentRegistration.Application.DTOs;
using StudentRegistration.Domain.Entities;

namespace StudentRegistration.Application.Mappings;

public class StudentMappingProfile : Profile
{
    public StudentMappingProfile()
    {
        CreateMap<Student, StudentDto>();
        CreateMap<CreateStudentDto, Student>();
        CreateMap<UpdateStudentDto, Student>()
            .ForMember(dest => dest.StudentId, opt => opt.Ignore());
    }
}
