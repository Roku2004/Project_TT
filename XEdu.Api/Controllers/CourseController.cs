using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.request.Course;
using XEdu.Core.DTOs.response.Course;
using XEdu.Core.DTOs.response.CourseEnrollment;
using XEdu.Core.Entities;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseController : ControllerBase
{
    private readonly CourseService _courseService;
    private readonly CourseEnrollService _courseEnrollService;

    public CourseController(CourseService courseService, CourseEnrollService courseEnrollService)
    {
        _courseService = courseService;
        _courseEnrollService = courseEnrollService;
    }

    private long GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return long.Parse(userIdClaim ?? "0");
    }
    
    [HttpGet("courses")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<PagedResult<CourseResponse>>> GetCourses([FromQuery] int page = 0,
                                                                            [FromQuery] int size = 10)
    {
        var teacherId = GetCurrentUserId();
        PagedResult<CourseResponse> courses = await _courseService.GetCoursesByTeacherAsync(teacherId, page, size);
        if (courses == null)
        {
            return NotFound(new ApiResponse<PagedResult<CourseResponse>>
            {
                Success = false,
                Message = "No courses found for this teacher.",
                Response = null
            });
        }
        return Ok(new ApiResponse<PagedResult<CourseResponse>>
        {
            Success = true,
            Message = "Get course by teacherId successfully.",
            Response = courses
        });
    }
    
    [HttpPost("createCourse")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> CreateCourses([FromBody] CreateCourse course)
    {
        var teacherId = GetCurrentUserId();
        string check = await _courseService.CreateCourseAsync(teacherId, course);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Create course successfully.",
            Response = check
        });
    }

    [HttpPut("updateCourse")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> UpdateCourse([FromBody] UpdateCourse updateCourse)
    {
        var teacherId = GetCurrentUserId();
        var course = await _courseService.UpdateCourseAsync(teacherId, updateCourse);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Update course successfully.",
            Response = course
        });
    }

    [HttpPut("publishCourse")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> PublishCourse([FromBody] PublishCourse publishCourse)
    {
        var teacherId = GetCurrentUserId();
        var course = await _courseService.publishCourseAsync(teacherId, publishCourse);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Published course successfully.",
            Response = course
        });
    }

    [HttpGet("getCourses")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<PagedResult<CourseResponse>>> GetCoursesByStudent([FromQuery] long subjectId,
                                                                                     [FromQuery] long gradeId,
                                                                                    [FromQuery] string? search,
                                                                                    [FromQuery] int page,
                                                                                    [FromQuery] int size)
    {
        var studentId = GetCurrentUserId();
        PagedResult<CourseResponse> courses = await _courseService.GetCoursesAsync(subjectId,gradeId,search,page, size, studentId);
        if (courses == null)
        {
            return NotFound(new ApiResponse<PagedResult<CourseResponse>>
            {
                Success = false,
                Message = "No courses found.",
                Response = null
            });
        }

        return Ok(new ApiResponse<PagedResult<CourseResponse>>
        {
            Success = true,
            Message = "Get courses successfully.",
            Response = courses
        });
    }

    [HttpGet("my-courses")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<PagedResult<CourseByStudentId>>> GetMyCourses([FromQuery] int page,
        [FromQuery] int size)
    {
        CourseByStudentId courseByStudentId = new CourseByStudentId();
        courseByStudentId.studentId = GetCurrentUserId();
        PagedResult<CourseByStudentId> courses = await _courseEnrollService.GetCoursesByStudentIdAsync(courseByStudentId, page, size);
        if (courses == null)
        {
            return NotFound(new ApiResponse<PagedResult<CourseByStudentId>>
            {
                Success = false,
                Message = "No courses found for this student.",
                Response = null
            });
        }
        return Ok(new ApiResponse<PagedResult<CourseByStudentId>>
        {
            Success = true,
            Message = "Get my courses successfully.",
            Response = courses
        }); 
    }
}
