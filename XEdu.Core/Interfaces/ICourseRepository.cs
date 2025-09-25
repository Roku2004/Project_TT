using XEdu.Core.Entities;
using XEdu.Core.Enums;

namespace XEdu.Core.Interfaces;

public interface ICourseRepository : IRepository<Course>
{
    Task<IEnumerable<Course>> GetPublishedCoursesAsync(int page = 1, int pageSize = 10);
    Task<IEnumerable<Course>> GetCoursesByTeacherAsync(long teacherId, int page = 1, int pageSize = 10);
    Task<IEnumerable<Course>> GetFreeCoursesAsync(int page = 1, int pageSize = 10);
    Task<IEnumerable<Course>> GetCoursesBySubjectAsync(long subjectId, int page = 1, int pageSize = 10);
    Task<IEnumerable<Course>> GetCoursesByGradeAsync(long gradeId, int page = 1, int pageSize = 10);
    Task<IEnumerable<Course>> SearchCoursesAsync(string keyword, int page = 1, int pageSize = 10);
    Task<IEnumerable<Course>> GetCoursesWithFiltersAsync(string? search, long? subjectId, long? gradeId, int page = 1, int pageSize = 10);
    Task<Course?> GetCourseWithDetailsAsync(long courseId);
}