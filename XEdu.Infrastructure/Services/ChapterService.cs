using AutoMapper;
using XEdu.Core.DTOs.request.Chapter;
using XEdu.Core.DTOs.response.Chapter;
using XEdu.Core.Entities;
using XEdu.Core.IService;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class ChapterService : IChapterService
{
    private readonly CourseRepository _courseRepository;
    private readonly ChapterRepository _chapterRepository;
    private readonly IMapper _mapper;
    private readonly XEduDbContext _dbContext;
    private readonly LessonRepository _lessonRepository;
    public ChapterService(CourseRepository courseRepository, IMapper mapper, ChapterRepository chapterRepository, XEduDbContext dbContext, LessonRepository lessonRepository)
    {
        _courseRepository = courseRepository;
        _mapper = mapper;
        _chapterRepository = chapterRepository;
        _dbContext = dbContext;
        _lessonRepository = lessonRepository;
    }
    public async Task<string> CreateChapterAsync(CreateChapter createChapter)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            // Kiểm tra trùng tên
            var existingChapter = await _chapterRepository.GetByChapterNameAndCourseIdAsync(createChapter.chapterName,createChapter.courseId);
            if (existingChapter != null)
            {
                return "Chapter name already exists";
            }
    
            // Kiểm tra course tồn tại
            var course = await _courseRepository.GetCourseByIdAsync(createChapter.courseId);
            if (course == null)
            {
                return "Course not found";
            }
    
            // Tạo chapter
            var chapter = _mapper.Map<Chapter>(createChapter);
            await _chapterRepository.AddAsync(chapter);
            
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
            
            return "Chapter created successfully";
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return $"Error: {ex.Message}";
        }
    }

    public async Task<List<ChapterResponse>?> GetChaptersAsync(long courseId)
    {
        List<Chapter> chapters = await _chapterRepository.GetChaptersByCourseIdAsync(courseId);
        if (chapters == null || !chapters.Any())
        {
            return null;
        }

        foreach (var chapter in chapters)
        {
            var sumDuration = await _lessonRepository.GetTotalDurationByChapterIdAsync(chapter.Id);
            chapter.Duration = sumDuration;
        }
        
        var chapterResponses = _mapper.Map<List<ChapterResponse>>(chapters);
        foreach (var chapterResponse in chapterResponses)
        {
            var countLessons = await _lessonRepository.GetTotalLessonByChapterIdAsync(chapterResponse.id);
            chapterResponse.countLessons = countLessons;
        }
        return chapterResponses;
    }

    public async Task<string> UpdateStatusChapterAsync(UpdateChapterRequest chapter)
    {
        var mess = string.Empty;
        var chapterExist = await _chapterRepository.GetByIdAsync(chapter.id);
        if (chapterExist == null)
        {
            mess = "Chapter not found";
            return mess;
        }
        chapterExist.Status = chapter.status;
        await _dbContext.SaveChangesAsync();
        mess = "Chapter status updated successfully";
        return mess;
    }
}