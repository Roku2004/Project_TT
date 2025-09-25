using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using XEdu.Core.DTOs.request.CourseEnroll;
using XEdu.Core.DTOs.response.CourseEnrollment;
using XEdu.Core.Entities;
using XEdu.Core.IService;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class CourseEnrollService : ICourseEnrollService
{
    private readonly CourseEnrollmentRepository _courseEnrollmentRepository;
    private readonly CourseRepository _courseRepository;
    private readonly IMapper _mapper;
    private readonly XEduDbContext _dbContext;
    private readonly EnrollLessonRepository _enrollLessonRepository;
    
    private readonly EnrollLessonService _enrollLessonService;
    
    public CourseEnrollService(
        CourseEnrollmentRepository courseEnrollmentRepository,
        CourseRepository courseRepository,
        IMapper mapper,
        XEduDbContext dbContext, EnrollLessonRepository enrollLessonRepository, EnrollLessonService enrollLessonService)
    {
        _courseEnrollmentRepository = courseEnrollmentRepository;
        _courseRepository = courseRepository;
        _mapper = mapper;
        _dbContext = dbContext;
        _enrollLessonRepository = enrollLessonRepository;
        _enrollLessonService = enrollLessonService;
    }
    public async Task<string> EnrollCourseAsync(AddCourseEnroll addCourseEnroll)
    {
        var course = await _courseRepository.GetCourseByIdAsync(addCourseEnroll.courseId);
        if (course == null)
        {
            return "Course not found";
        }
        var enrollment = _mapper.Map<CourseEnrollment>(addCourseEnroll);
        await _courseEnrollmentRepository.AddAsync(enrollment);
        await _dbContext.SaveChangesAsync();
        await _enrollLessonService.EnrollLessonAsync((int)enrollment.Id);
        return "Enrollment successful";
    }

    public async Task<PagedResult<CourseByStudentId>> GetCoursesByStudentIdAsync(CourseByStudentId courseByStudentId, int page, int size)
    {
        IQueryable<CourseEnrollment> query = _dbContext.CourseEnrollments
            .Where(c => c.StudentId == courseByStudentId.studentId)
            .Include(c => c.Course);
    
        int totalElements = await query.CountAsync();
    
        var courses = await query
            .Skip(page * size)
            .Take(size)
            .ProjectTo<CourseByStudentId>(_mapper.ConfigurationProvider)
            .ToListAsync();
    
        return new PagedResult<CourseByStudentId>
        {
            Content = courses,
            TotalElements = totalElements,
            Page = page,
            Size = size,
        };
    }

    public async Task<string> UpdateProgessAsync(long studentId, UpdateProgress updateProgress)
    {
        var enrollCourse = await _courseEnrollmentRepository.GetByStudentIdAndCourseIdAsync(studentId, updateProgress.courseId);
        if (enrollCourse == null)
        {
            return "Enrollment not found";
        }
        
        var enrollLesson = await _enrollLessonRepository.GetByLessonIdAndCourseIdAsync(updateProgress.lessonId, enrollCourse.Id);
        if(enrollLesson == null)
        {
          return "Enrollment lesson not found";
        }
        
        enrollLesson.CompletedAt = DateTime.UtcNow;
        enrollLesson.Completed = true;
        await _enrollLessonRepository.UpdateAsync(enrollLesson);
        
        enrollCourse.LessonsCompleted += updateProgress.lessonsCompleted;
        if (enrollCourse.LessonsCompleted < updateProgress.totalLessons)
        {
            var progress = (decimal)enrollCourse.LessonsCompleted / updateProgress.totalLessons * 100;
            enrollCourse.Progress = Math.Round(Convert.ToDecimal(progress), 1);
        }
        else if (enrollCourse.LessonsCompleted == updateProgress.totalLessons)
        {
            enrollCourse.Progress = 100;
            enrollCourse.CompletedAt = DateTime.UtcNow;
        }
        enrollCourse.UpdatedAt = DateTime.UtcNow;
        await _courseEnrollmentRepository.UpdateAsync(enrollCourse);
        await _dbContext.SaveChangesAsync();
        return "Progress updated successfully";
    }
}