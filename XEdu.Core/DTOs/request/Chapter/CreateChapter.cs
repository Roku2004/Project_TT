using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.request.Chapter;

public class CreateChapter
{
    public string chapterName { get; set; } = string.Empty;
    public long courseId { get; set; }
    public int order_index { get; set; }
    public ChapterStatus status { get; set; }
}