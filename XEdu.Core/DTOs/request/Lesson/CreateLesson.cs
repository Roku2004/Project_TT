using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.request.Lesson;

public class CreateLesson
{
    public long chapterId { get; set; }
    public string title { get; set; } = string.Empty;
    public string? description { get; set; }
    public int orderIndex { get; set; }
    public LessonType type { get; set; }
    public string? videoUrl { get; set; }
    public string? content { get; set; }
    public string? attachmentUrl { get; set; }
    public string? externalLink { get; set; }
    public int duration { get; set; } // Duration in seconds
    public bool isFree { get; set; }
    public bool published { get; set; }
}