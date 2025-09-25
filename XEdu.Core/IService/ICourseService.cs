using XEdu.Core.DTOs.request.Course;
using XEdu.Core.DTOs.response.Course;
using XEdu.Core.Entities;
using XEdu.Core.Enums;

namespace XEdu.Core.IService;

public interface ICourseService
{
    // Teacher
    Task<PagedResult<object>> GetCoursesAsync(int page, int size, string status);
    Task<bool> UpdateStatusAsync(long courseId, CourseStatus status);
    Task<PagedResult<CourseResponse>> GetCoursesByTeacherAsync(long teacherId, int page, int size);
    Task<string> CreateCourseAsync(long teacherId, CreateCourse course);
    Task<string> UpdateCourseAsync(long teacherId, UpdateCourse course);
    Task<string> publishCourseAsync(long teacherId, PublishCourse course );
    
    // Student
    Task<PagedResult<CourseResponse>> GetCoursesAsync(long? subjectId, long? gradeId, string search,int page, int size, long studentId);
}