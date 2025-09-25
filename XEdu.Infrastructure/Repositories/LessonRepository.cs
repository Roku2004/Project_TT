using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class LessonRepository : Repository<Lesson>
{
    public LessonRepository(XEduDbContext context) : base(context)
    {
    }

    public async Task<int> GetTotalDurationByChapterIdAsync(long chapterId)
    {
        var lessons = await _context.Lessons
            .Where(l => l.ChapterId == chapterId)
            .ToListAsync();
        
        return lessons.Sum(l => l.Duration ?? 0);
    }
    
    public async Task<int> GetTotalLessonByChapterIdAsync(long chapterId)
    {
        return await _context.Lessons
            .Where(l => l.ChapterId == chapterId)
            .CountAsync();
    }

    public async Task<List<Lesson>> GetLessonsByChapterId(long chapterId)
    {
        return await _context.Lessons
            .Where(l => l.ChapterId == chapterId)
            .ToListAsync();
    }
    
    public async Task<List<Lesson>> GetLessonAsync(long courseId)
    {
        var query = from l in _context.Lessons
            join c in _context.Chapters on l.ChapterId equals c.Id
            join c2 in _context.Courses on c.CourseId equals c2.Id
            where c2.Id == courseId
            select l;

        return await query.ToListAsync();
    }

}