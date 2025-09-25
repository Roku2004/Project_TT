using AutoMapper;
using XEdu.Core.DTOs.response.EnrollmentLesson;
using XEdu.Core.Entities;
using XEdu.Core.IService;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class EnrollLessonService : IEnrollLessonService
{
    private readonly EnrollLessonRepository _enrollLessonRepository;
    private readonly CourseEnrollmentRepository _courseEnrollmentRepository;
    private readonly LessonRepository _lessonRepository;
    private readonly CourseRepository _courseRepository;
    private readonly ChapterRepository _chapterRepository;
    private readonly XEduDbContext _dbContext;
    private readonly IMapper _mapper;

    public EnrollLessonService(EnrollLessonRepository enrollLessonRepository, ChapterRepository chapterRepository, LessonRepository lessonRepository, CourseEnrollmentRepository courseEnrollmentRepository, CourseRepository courseRepository, XEduDbContext dbContext, IMapper mapper)
    {
        _enrollLessonRepository = enrollLessonRepository;
        _chapterRepository = chapterRepository;
        _lessonRepository = lessonRepository;
        _courseEnrollmentRepository = courseEnrollmentRepository;
        _courseRepository = courseRepository;
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<string> EnrollLessonAsync(int courseEnrollmentId)
    {
        var courseEnrollment = await _courseEnrollmentRepository.GetByIdAsync(courseEnrollmentId);
        if (courseEnrollment == null)
        {
            return "Course enrollment not found";
        }
        List<Lesson> lessons = await _lessonRepository.GetLessonAsync(courseEnrollment.CourseId);
        foreach (Lesson lesson in lessons)
        {
            int lessonId = (int)lesson.Id;
            var enrollmentLesson = await _enrollLessonRepository.GetByLessonIdAndCourseIdAsync(courseEnrollmentId, courseEnrollment.Id);
            if (enrollmentLesson != null)
            {
                return "Lesson already enrolled";
            }
            EnrollmentLesson newEnrollment = new EnrollmentLesson
            {
                LessonId = lessonId,
                CourseEnrollmentId = courseEnrollmentId,
                Completed = false,
                CompletedAt = null
            };
            await _enrollLessonRepository.AddAsync(newEnrollment);
        }
        await _dbContext.SaveChangesAsync();
        return "Lesson enrollment successful";
    }

    public async Task<List<CompleteLesson>> CompleteLessonAsync(long studentId, long courseId)
    {
        var courseEnrollment = await _courseEnrollmentRepository.GetByStudentIdAndCourseIdAsync(studentId, courseId);
        if (courseEnrollment == null)
        {
            return null;
        }
        var enrollmentLessons = await _enrollLessonRepository.GetByCourseEnrollmentIdAsync(courseEnrollment.Id);
        if (enrollmentLessons == null)
        {
            return null;
        }
        var mappedLessons = _mapper.Map<List<CompleteLesson>>(enrollmentLessons);
        return mappedLessons;
    }
}