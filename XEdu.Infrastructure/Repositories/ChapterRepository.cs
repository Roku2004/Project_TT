using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class ChapterRepository : Repository<Chapter>
{
    public ChapterRepository(XEduDbContext context) : base(context)
    {
        
    }

    public async Task<Chapter?> GetByChapterNameAndCourseIdAsync(string chapterName, long courseId)
    {
        return await _context.Chapters
            .FirstOrDefaultAsync(c => c.ChapterName == chapterName && c.CourseId == courseId);
    }

    public async Task<List<Chapter>> GetChaptersByCourseIdAsync(long courseId)
    {
        return await _context.Chapters
            .Where(c => c.CourseId == courseId)
            .ToListAsync();
    }
}