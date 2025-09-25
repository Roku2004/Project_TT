using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.response.Lesson;

public class LessonResponse
{
    public long id { get; set; }
    public long courseId { get; set; }
    public string title { get; set; } = string.Empty;
    public string? description { get; set; }
    public int orderIndex { get; set; }
    public LessonType type { get; set; }
    public string? videoUrl { get; set; }
    public string? content { get; set; }
    public string? attachmentUrl { get; set; }
    public string? externalLink { get; set; }
    public int duration { get; set; }
    public bool isFree { get; set; }
    public bool published { get; set; }
    public bool completed { get; set; }
}