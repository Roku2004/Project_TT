using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class EnrollLessonRepository : Repository<EnrollmentLesson>
{
    public EnrollLessonRepository(XEduDbContext context) : base(context)
    {
    }

    public async Task<EnrollmentLesson?> GetByLessonIdAndCourseIdAsync(int lessonId, long courseId)
    {
        return await  _context.EnrollmentLessons
            .FirstOrDefaultAsync(el => el.LessonId == lessonId && el.CourseEnrollmentId == courseId);
    }

    public async Task<List<EnrollmentLesson>> GetByCourseEnrollmentIdAsync(long courseEnrollId)
    {
        var query = from el in _context.EnrollmentLessons
            where el.CourseEnrollmentId == courseEnrollId
            select el;
        
        return await query.ToListAsync();
    }
}