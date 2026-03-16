namespace StudentRegistration.Domain.Entities;

public class Student
{
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string MobileNo { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PinCode { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
}
