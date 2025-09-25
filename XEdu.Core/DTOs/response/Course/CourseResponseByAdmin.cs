namespace XEdu.Core.DTOs.response.Course;

public class CourseResponseByAdmin
{
    public string Title { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int StudentsCount { get; set; }
}