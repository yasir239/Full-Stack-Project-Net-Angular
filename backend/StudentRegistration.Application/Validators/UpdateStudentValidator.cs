using FluentValidation;
using StudentRegistration.Application.DTOs;

namespace StudentRegistration.Application.Validators;

public class UpdateStudentValidator : AbstractValidator<UpdateStudentDto>
{
    public UpdateStudentValidator()
    {
        RuleFor(x => x.StudentName)
            .NotEmpty().WithMessage("Student name is required.")
            .MaximumLength(100).WithMessage("Student name must not exceed 100 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(150).WithMessage("Email must not exceed 150 characters.");

        RuleFor(x => x.MobileNo)
            .NotEmpty().WithMessage("Mobile number is required.")
            .MaximumLength(10).WithMessage("Mobile number must not exceed 10 digits.")
            .Matches(@"^\d+$").WithMessage("Mobile number must contain only digits.");

        RuleFor(x => x.City)
            .MaximumLength(50).When(x => x.City is not null);

        RuleFor(x => x.State)
            .MaximumLength(50).When(x => x.State is not null);

        RuleFor(x => x.PinCode)
            .MaximumLength(10).When(x => x.PinCode is not null)
            .Matches(@"^\d+$").WithMessage("Pin code must contain only digits.")
            .When(x => !string.IsNullOrWhiteSpace(x.PinCode));

        RuleFor(x => x.AddressLine1)
            .MaximumLength(200).When(x => x.AddressLine1 is not null);

        RuleFor(x => x.AddressLine2)
            .MaximumLength(200).When(x => x.AddressLine2 is not null);
    }
}
