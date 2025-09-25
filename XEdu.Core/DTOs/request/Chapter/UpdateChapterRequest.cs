using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.request.Chapter;

public class UpdateChapterRequest
{
    public long id { get; set; }
    public ChapterStatus status { get; set; }
}