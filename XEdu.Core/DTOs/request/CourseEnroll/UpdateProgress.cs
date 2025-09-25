namespace XEdu.Core.DTOs.request.CourseEnroll;

public class UpdateProgress
{
    public long courseId { get; set; }
    public int lessonsCompleted { get; set; }
    public int? totalLessons { get; set; }
    public int lessonId { get; set; }
}