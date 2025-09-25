namespace XEdu.Core.DTOs.response.Classroom;

public class ClassroomByIdResponse
{
    public long id { get; set; }
    public string name { get; set; } = string.Empty;
    public string description { get; set; } = string.Empty;
    public Entities.Grade grade { get; set; }
    public Entities.Subject subject { get; set; } = null!;
    public long currentStudentCount { get; set; }
    public long maxStudents { get; set; }
    public string classCode { get; set; } = string.Empty;
}