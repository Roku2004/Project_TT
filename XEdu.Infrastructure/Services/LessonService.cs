using AutoMapper;
using XEdu.Core.DTOs.request.Lesson;
using XEdu.Core.DTOs.response.EnrollmentLesson;
using XEdu.Core.DTOs.response.Lesson;
using XEdu.Core.Entities;
using XEdu.Core.IService;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class LessonService : ILessonService
{
    private readonly ChapterRepository _chapterRepository;
    private readonly LessonRepository _lessonRepository;
    private readonly IMapper _mapper;
    private readonly EnrollLessonService _enrollLessonService;
    
    public LessonService(IMapper mapper, LessonRepository lessonRepository, ChapterRepository chapterRepository, EnrollLessonService enrollLessonService)
    {
        _mapper = mapper;
        _lessonRepository = lessonRepository;
        _chapterRepository = chapterRepository;
        _enrollLessonService = enrollLessonService;
    }

    public async Task<string> CreateLessonAsync(CreateLesson lesson)
    {
        var existingChapter = await _chapterRepository.GetByIdAsync(lesson.chapterId);
        if (existingChapter == null)
        {
            return "Chapter not found";
        }

        if (lesson.videoUrl == null)
        {
            lesson.videoUrl = null;
        }
        if(lesson.content == null)
        {
            lesson.content = null;
        }
        var mapLesson = _mapper.Map<Lesson>(lesson);
        mapLesson.CreatedAt = DateTime.UtcNow;
        await _lessonRepository.AddAsync(mapLesson);
        return "Lesson created successfully";
    }

    public async Task<List<LessonResponse>> GetLessonsAsync(long chapterId,long studentId, string role)
    {
        List<Lesson> lessons = await _lessonRepository.GetLessonsByChapterId(chapterId);
        if (lessons == null || !lessons.Any())
        {
            return null;
        }
        
        var chapter = await _chapterRepository.GetByIdAsync(chapterId);
        var lessonResponses = _mapper.Map<List<LessonResponse>>(lessons);
        
        if(role == "STUDENT")
        {
            var lessonComplete = await _enrollLessonService.CompleteLessonAsync(studentId, chapter.CourseId);
            foreach (CompleteLesson completeLesson in lessonComplete)
            {
                foreach (LessonResponse lessonResponse in lessonResponses)
                {
                    if (completeLesson.lessonId == lessonResponse.id)
                    {
                        lessonResponse.completed = completeLesson.completed;
                    }
                }
            }
        }
        else
        {
            foreach (LessonResponse lessonResponse in lessonResponses)
            {
                lessonResponse.completed = false;
            }
        }
        return lessonResponses;
    }

    public async Task<LessonDetails?> GetLessonByIdAsync(long lessonId)
    {
        var lesson = await _lessonRepository.GetByIdAsync(lessonId);
        if (lesson == null)
        {
            return null;
        }
        var lessonResponse = _mapper.Map<LessonDetails>(lesson);
        return lessonResponse;
    }
}