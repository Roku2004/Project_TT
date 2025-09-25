using XEdu.Core.Entities;
using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.request.Course;

public class CreateCourse
{
    public string title { get; set; } = string.Empty;
    public string? description { get; set; }
    public string? objectives { get; set; }
    public string? thumbnail { get; set; }
    public decimal price { get; set; }
    public bool isFree { get; set; }
    public CourseLevel level { get; set; }
    public int? estimatedDuration { get; set; }
    public long subjectId { get; set; }
    public long gradeId { get; set; }
    public long? topicId { get; set; }
    public CourseStatus status { get; set; }
}