using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.request.Lesson;
using XEdu.Core.DTOs.response.Lesson;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonController : ControllerBase
{
    private readonly LessonService _lessonService;

    public LessonController(LessonService lessonService)
    {
        _lessonService = lessonService;
    }

    private long GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return long.Parse(userIdClaim ?? "0");
    }

    [HttpPost("createLesson")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> CreateLesson([FromBody] CreateLesson lessonRequest)
    {
        var teacherId = GetCurrentUserId();
        string result = await _lessonService.CreateLessonAsync(lessonRequest);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Create lesson successfully.",
            Response = result
        });
    }

    [HttpGet("lessons")]
    [Authorize(Roles = "TEACHER,STUDENT,ADMIN")]
    public async Task<ActionResult<ApiResponse<List<LessonResponse>>>> GetLessons([FromQuery] long chapterId)
    {
        var studentId = GetCurrentUserId();
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var lessons = await _lessonService.GetLessonsAsync(chapterId,studentId,role);
        if (lessons == null || !lessons.Any())
        {
            return NotFound(new ApiResponse<List<LessonResponse>>
            {
                Success = false,
                Response = null
            });
        }

        return Ok(new ApiResponse<List<LessonResponse>>
        {
            Success = true,
            Message = "Lessons retrieved successfully.",
            Response = lessons
        });
    }

    [HttpGet("lessonDetail")]
    [Authorize(Roles = "TEACHER,STUDENT,ADMIN")]
    public async Task<ActionResult<ApiResponse<LessonDetails>>> GetLessonById([FromQuery] long lessonId)
    {
        var lesson = await _lessonService.GetLessonByIdAsync(lessonId);
        if (lesson == null)
        {
            return NotFound(new ApiResponse<LessonDetails>
                {
                    Success = false,
                    Message = "Lesson not found",
                    Response = null
                }
            );
        }

        return Ok(new ApiResponse<LessonDetails>
        {
            Success = true,
            Message = "Lesson retrieved successfully.",
            Response = lesson
        });
    }
}