using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.request.Course;

public class UpdateCourse
{
    public long id { get; set; }
    public string? title { get; set; } = string.Empty;
    public string? description { get; set; }
    public string? objectives { get; set; }
    public string? thumbnail { get; set; }
    public decimal? price { get; set; }
    public bool? isFree { get; set; }
    public CourseLevel? level { get; set; }
    public int? estimatedDuration { get; set; }
}