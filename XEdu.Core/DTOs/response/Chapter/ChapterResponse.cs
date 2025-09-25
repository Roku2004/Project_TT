using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.response.Chapter;

public class ChapterResponse
{
    public long id { get; set; }
    public string chaptername { get; set; }
    public ChapterStatus status { get; set; }
    public int orderindex { get; set; }
    public string type { get; set; } = "TOPIC";
    public int? duration { get; set; }
    public int countLessons { get; set; }
}