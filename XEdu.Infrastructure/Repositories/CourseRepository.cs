using AutoMapper;
using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Core.Enums;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class CourseRepository : Repository<Course>
{
    public CourseRepository(XEduDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Course>> GetPublishedCoursesAsync(int page = 1, int pageSize = 10)
    {
        return await _dbSet
            .Include(c => c.Teacher)
            .Include(c => c.Subject)
            .Include(c => c.Grade)
            .Include(c => c.Topic)
            .Where(c => c.Status == CourseStatus.PUBLISHED && c.Published)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> GetCoursesByTeacherAsync(long teacherId, int page = 1, int pageSize = 10)
    {
        return await _dbSet
            .Include(c => c.Subject)
            .Include(c => c.Grade)
            .Include(c => c.Topic)
            .Where(c => c.TeacherId == teacherId)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> GetFreeCoursesAsync(int page = 1, int pageSize = 10)
    {
        return await _dbSet
            .Include(c => c.Teacher)
            .Include(c => c.Subject)
            .Include(c => c.Grade)
            .Where(c => c.IsFree && c.Status == CourseStatus.PUBLISHED)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> GetCoursesBySubjectAsync(long subjectId, int page = 1, int pageSize = 10)
    {
        return await _dbSet
            .Include(c => c.Teacher)
            .Include(c => c.Subject)
            .Include(c => c.Grade)
            .Where(c => c.SubjectId == subjectId && c.Status == CourseStatus.PUBLISHED)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> GetCoursesByGradeAsync(long gradeId, int page = 1, int pageSize = 10)
    {
        return await _dbSet
            .Include(c => c.Teacher)
            .Include(c => c.Subject)
            .Include(c => c.Grade)
            .Where(c => c.GradeId == gradeId && c.Status == CourseStatus.PUBLISHED)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> SearchCoursesAsync(string keyword, int page = 1, int pageSize = 10)
    {
        var query = _dbSet
            .Include(c => c.Teacher)
            .Include(c => c.Subject)
            .Include(c => c.Grade)
            .Where(c => c.Status == CourseStatus.PUBLISHED);

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var term = keyword.ToLower();
            query = query.Where(c =>
                c.Title.ToLower().Contains(term) ||
                c.Description!.ToLower().Contains(term));
        }

        return await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Course>> GetCoursesWithFiltersAsync(string? search, long? subjectId, long? gradeId,
        int page = 1, int pageSize = 10)
    {
        var query = _dbSet
            .Include(c => c.Teacher)
            .Include(c => c.Subject)
            .Include(c => c.Grade)
            .Where(c => c.Status == CourseStatus.PUBLISHED);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(c =>
                c.Title.ToLower().Contains(term) ||
                c.Description!.ToLower().Contains(term));
        }

        if (subjectId.HasValue)
        {
            query = query.Where(c => c.SubjectId == subjectId.Value);
        }

        if (gradeId.HasValue)
        {
            query = query.Where(c => c.GradeId == gradeId.Value);
        }

        return await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Course?> GetCourseWithDetailsAsync(long courseId)
    {
        return await _dbSet
            .Include(c => c.Teacher)
            .Include(c => c.Subject)
            .Include(c => c.Grade)
            .Include(c => c.Topic)
            .FirstOrDefaultAsync(c => c.Id == courseId);
    }

    public async Task<Course?> GetCourseByTeacherIdAndIdAsync(long teacherId, long courseId)
    {
        // Thực hiện truy vấn tại đây, ví dụ nếu bạn dùng Entity Framework:
        return await _context.Courses
            .FirstOrDefaultAsync(c => c!.Id == courseId && c.TeacherId == teacherId);
    }

    public async Task<Course?> GetCourseByIdAsync(long courseId)
    {
        return await _context.Courses
            .FirstOrDefaultAsync(c => c!.Id == courseId );
    }
}
