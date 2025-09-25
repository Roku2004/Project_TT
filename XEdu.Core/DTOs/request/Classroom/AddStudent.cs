namespace XEdu.Core.DTOs.request.Classroom;

public class AddStudent
{
    public long classid { get; set; }
    public string studentEmail { get; set; } = string.Empty;
}