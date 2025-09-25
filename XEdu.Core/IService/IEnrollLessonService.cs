using XEdu.Core.DTOs.response.EnrollmentLesson;
using XEdu.Core.Entities;

namespace XEdu.Core.IService;

public interface IEnrollLessonService
{
    Task<string> EnrollLessonAsync(int courseEnrollmentId);
    Task<List<CompleteLesson>> CompleteLessonAsync(long studentId,long courseId);
}