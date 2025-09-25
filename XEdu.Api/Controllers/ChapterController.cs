using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.request.Chapter;
using XEdu.Core.DTOs.response.Chapter;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ChapterController : ControllerBase
{
    private readonly ChapterService _chapterService;

    public ChapterController(ChapterService chapterService)
    {
        _chapterService = chapterService;
    }

    private long GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return long.Parse(userIdClaim ?? "0");
    }
    
    [HttpPost("CreateChapter")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> CreateChapterAsync([FromBody] CreateChapter createChapter)
    {
        var teacherId = GetCurrentUserId();
        var check = await _chapterService.CreateChapterAsync(createChapter);
        if(check == "Chapter created successfully")
        {
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Create Chapter successfully.",
                Response = check
            });
        }
        else
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Response = check
            });
        }
    }

    [HttpGet("GetChapters")]
    [Authorize(Roles = "TEACHER,STUDENT")]
    public async Task<ActionResult<ApiResponse<List<ChapterResponse>>>> GetChaptersAsync([FromQuery] long courseId)
    {
        var chapters = await _chapterService.GetChaptersAsync(courseId);
        if (chapters == null )
        {
            return NotFound(new ApiResponse<List<ChapterResponse>>
            {
                Success = false,
                Message = "No chapters found for this course."
            });
        }

        return Ok(new ApiResponse<List<ChapterResponse>>
        {
            Success = true,
            Message = "Chapters retrieved successfully.",
            Response = chapters
        });
    }

    [HttpPut("UpdateChapter")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> UpdateChapterAsync([FromBody] UpdateChapterRequest updateChapter)
    {
        var teacherId = GetCurrentUserId();
        var result = await _chapterService.UpdateStatusChapterAsync(updateChapter);
        if (result == "Chapter status updated successfully")
        {
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Chapter status updated successfully.",
                Response = result
            });
        }
        else
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Response = result
            });
        }
    }
}