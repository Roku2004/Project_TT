using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.request.CourseEnroll;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseEnrollController : ControllerBase
{
    private readonly CourseEnrollService _courseEnrollService;

    public CourseEnrollController(CourseEnrollService courseEnrollService)
    {
        _courseEnrollService = courseEnrollService;
    }
    
    private long GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return long.Parse(userIdClaim ?? "0");
    }
    
    [HttpPost("addEnroll")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<string>> AddCourseEnroll([FromBody] AddCourseEnroll addCourseEnroll)
    {
        addCourseEnroll.studentId = GetCurrentUserId();
        string result = await _courseEnrollService.EnrollCourseAsync(addCourseEnroll);
        
        if (result == "Course not found")
        {
            return NotFound(new ApiResponse<string>
            {
                Success = false,
                Message = "Course not found",
                Response = result
            });
        }
        
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Enrollment successful",
            Response = result
        });
    }

    [HttpPut("updateProgress")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<string>> UpdateCourseProgress([FromBody] UpdateProgress updateProgress)
    {
        var studentId = GetCurrentUserId();
        var result = await _courseEnrollService.UpdateProgessAsync(studentId, updateProgress);
        if (result == "Enrollment not found" || result == "Enrollment lesson not found")
        {
            return NotFound(new ApiResponse<string>
            {
                Success = false,
                Message = "Enrollment not found",
            });
        }
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Progress updated successfully",
            Response = result
        });
    }
}