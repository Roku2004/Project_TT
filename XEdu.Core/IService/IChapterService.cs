using XEdu.Core.DTOs.request.Chapter;
using XEdu.Core.DTOs.response.Chapter;

namespace XEdu.Core.IService;

public interface IChapterService
{
    Task<string> CreateChapterAsync(CreateChapter chapter);
    Task<List<ChapterResponse>?> GetChaptersAsync(long courseId);
    
    Task<string> UpdateStatusChapterAsync(UpdateChapterRequest chapter);
}