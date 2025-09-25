namespace XEdu.Core.DTOs.response.Lesson;

public class LessonDetails
{
    public string attachmentUrl { get; set; } = string.Empty;
    public string content { get; set; } = string.Empty;
    public string description { get; set; } = string.Empty;
    public string externalLink { get; set; } = string.Empty;
    public string title { get; set; } = string.Empty;
    public string videoUrl { get; set; } = string.Empty;
    public string type { get; set; } = string.Empty;
    public int chapterId { get; set; }
}