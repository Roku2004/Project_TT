using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using XEdu.Core.DTOs.request.Course;
using XEdu.Core.DTOs.response.Course;
using XEdu.Core.Entities;
using XEdu.Core.Enums;
using XEdu.Core.IService;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class CourseService : ICourseService
{
    private readonly XEduDbContext _dbContext;
    private readonly CourseRepository _courseRepository;
    private readonly IMapper _mapper;
    private readonly CourseEnrollmentRepository _courseEnrollmentRepository;
    
    public CourseService(XEduDbContext dbContext, CourseRepository courseRepository, IMapper mapper, CourseEnrollmentRepository courseEnrollmentRepository)
    {
        _dbContext = dbContext;
        _courseRepository = courseRepository;
        _mapper = mapper;
        _courseEnrollmentRepository = courseEnrollmentRepository;
    }
    public async Task<PagedResult<object>> GetCoursesAsync(int page, int size, string status)
    {
        IQueryable<Course> query = _dbContext.Courses
            .Include(c => c.Teacher)
            .Include(c => c.Subject)
            .Include(c => c.Grade);
    
        // Apply status filter
        if (!string.IsNullOrEmpty(status))
        {
            if (Enum.TryParse<CourseStatus>(status, true, out var parsedStatus))
            {
                query = query.Where(c => c.Status == parsedStatus);
            }
            else
            {
                throw new ArgumentException("Invalid status");
            }
        }
    
        int totalElements = await query.CountAsync();
        
        var courses = await query
            .Skip(page * size)
            .Take(size)
            .Select(course => new {
                course.Id,
                course.Title,
                TeacherName = course.Teacher != null ? course.Teacher.FullName : "Unknown",
                SubjectName = course.Subject != null ? course.Subject.Name : "Unknown",
                GradeName = course.Grade != null ? course.Grade.Name : "Unknown",
                Status = course.Status.ToString(),
                StudentsCount = 0,
                course.CreatedAt
            })
            .ToListAsync();
    
        return new PagedResult<object>
        {
            Content = courses,
            TotalElements = totalElements,
            Page = page,
            Size = size
        };
    }

    public async Task<bool> UpdateStatusAsync(long courseId, CourseStatus status)
    {
        var course = await _courseRepository.GetByIdAsync(courseId);
        if (course == null)
        {
            return false;
        }
        course.Status = status;
        course.UpdatedAt = DateTime.UtcNow;
        await _courseRepository.UpdateAsync(course);
        return true;
    }

    public async Task<PagedResult<CourseResponse>> GetCoursesByTeacherAsync(long teacherId, int page, int size)
    {
        var teacher = await _dbContext.Users.FindAsync(teacherId);
        if (teacher == null)
        {
            return new PagedResult<CourseResponse>
            {
                Content = new List<CourseResponse>(),
                TotalElements = 0,
                Page = page,
                Size = size
            };
        }

        var coursesQuery = _dbContext.Courses
            .Where(c => c.TeacherId == teacherId)
            .OrderByDescending(c => c.CreatedAt);

        var totalElements = await coursesQuery.CountAsync();

        var pagedCourses = await coursesQuery
            .Skip(page * size)
            .Take(size)
            .ProjectTo<CourseResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return new PagedResult<CourseResponse>
        {
            Content = pagedCourses,
            TotalElements = totalElements,
            Page = page,
            Size = size
        };
    }

    public async Task<string> CreateCourseAsync(long teacherId, CreateCourse course)
    {
        var teacher = await _dbContext.Users.FindAsync(teacherId);
        if (teacher == null)
        {
            return "Teacher not found";
        }

        Course courseEntity = _mapper.Map<Course>(course);
        courseEntity.TeacherId = teacherId;
        courseEntity.CreatedAt = DateTime.UtcNow;
        await _courseRepository.AddAsync(courseEntity);
        return "Course created successfully";
    }

    public async Task<string> UpdateCourseAsync(long teacherId, UpdateCourse course)
    {
        var existingCourse = await _courseRepository.GetCourseByTeacherIdAndIdAsync(teacherId, course.id);

        if (existingCourse == null)
        {
            return "Course not found";
        }

        if (course.title == null)
        {
            course.title = existingCourse.Title;
        }
        var mappedCourse = _mapper.Map(course, existingCourse);
        mappedCourse.UpdatedAt = DateTime.UtcNow;
        await _courseRepository.UpdateAsync(mappedCourse);
        return "Course updated successfully";
    }

    public async Task<string> publishCourseAsync(long teacherId, PublishCourse course)
    {
        var existingCourse = await _courseRepository.GetCourseByTeacherIdAndIdAsync(teacherId, course.id);

        if (existingCourse == null)
        {
            return "Course not found";
        }
        
        if(existingCourse.Status == CourseStatus.DRAFT){
            var mappedCourse = _mapper.Map(course, existingCourse);
            mappedCourse.UpdatedAt = DateTime.UtcNow;
            await _courseRepository.UpdateAsync(mappedCourse);
            return "Course published successfully";
        }
        else
        {
            return "Course is already published";
        }
    }

    public async Task<PagedResult<CourseResponse>> GetCoursesAsync(long? subjectId, long? gradeId, string search, int page, int size, long studentId)
    {
        IQueryable<Course> query = _dbContext.Courses
            .Where(c => c.Status == CourseStatus.PUBLISHED)
            .Include(c => c.Subject)
            .Include(c => c.Grade)
            .Include(c => c.Teacher);
        
        if (subjectId.HasValue && subjectId.Value > 0)
        {
            query = query.Where(c => c.SubjectId == subjectId.Value);
        }
        
        if (gradeId.HasValue && gradeId.Value > 0)
        {
            query = query.Where(c => c.GradeId == gradeId.Value);
        }
        
        if (!string.IsNullOrEmpty(search) && !string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(c =>
                c.Title.ToLower().Contains(searchLower)
                // || (c.Description != null && c.Description.ToLower().Contains(searchLower)) 
                // || (c.Objectives != null && c.Objectives.ToLower().Contains(searchLower))
            );
        }
        
        query = query.Where(c => !_dbContext.CourseEnrollments
            .Any(e => e.CourseId == c.Id && e.StudentId == studentId));
        
        var totalElements = await query.CountAsync();
        
        var courses = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip(page * size)
            .Take(size)
            .ProjectTo<CourseResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();
        
        return new PagedResult<CourseResponse>
        {
            Content = courses,
            TotalElements = totalElements,
            Page = page,
            Size = size
        };
    }
}