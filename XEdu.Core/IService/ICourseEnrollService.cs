using XEdu.Core.DTOs.request.CourseEnroll;
using XEdu.Core.DTOs.response.CourseEnrollment;
using XEdu.Core.Entities;

namespace XEdu.Core.IService;

public interface ICourseEnrollService
{
    Task<string> EnrollCourseAsync(AddCourseEnroll addCourseEnroll);
    Task<PagedResult<CourseByStudentId>> GetCoursesByStudentIdAsync(CourseByStudentId courseByStudentId, int page, int size);
    Task<string> UpdateProgessAsync(long studentId,UpdateProgress updateProgress);
}