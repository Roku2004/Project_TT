using XEdu.Core.DTOs.request.Lesson;
using XEdu.Core.DTOs.response.Lesson;
using XEdu.Core.Entities;

namespace XEdu.Core.IService;

public interface ILessonService
{
    Task<string> CreateLessonAsync(CreateLesson lesson);
    Task<List<LessonResponse>> GetLessonsAsync(long chapterId, long studentId, string role);
    Task<LessonDetails?> GetLessonByIdAsync(long lessonId);
}