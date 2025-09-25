using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.response.Course;

public class CourseResponse
{
    public long id { get; set; }
    public string title { get; set; } = string.Empty;
    public string? description { get; set; }
    // public string? objectives { get; set; }
    public string? thumbnail { get; set; }
    public decimal price { get; set; }
    public bool isFree { get; set; }
    public CourseLevel level { get; set; }
    public int? estimatedDuration { get; set; }
    public Entities.User Teacher { get; set; }
    public string subjectName { get; set; } = string.Empty;
    public string gradeName { get; set; } = string.Empty;
    // public string? topicName { get; set; }
    public CourseStatus status { get; set; } 
    // public bool published { get; set; }
    public DateTime createdAt { get; set; }
    // public int lessonCount { get; set; }

}