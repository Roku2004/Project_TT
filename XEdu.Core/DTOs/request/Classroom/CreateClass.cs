namespace XEdu.Core.DTOs.request.Classroom;

public class CreateClass
{
    public string name { get; set; } = string.Empty;
    public string description { get; set; } = string.Empty;
    public long subjectId { get; set; }
    public long gradeId { get; set; }
    
    public int? maxStudents { get; set; } 
}