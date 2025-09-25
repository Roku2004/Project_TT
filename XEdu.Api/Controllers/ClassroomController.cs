using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.request.Classroom;
using XEdu.Core.DTOs.response.Classroom;
using XEdu.Core.DTOs.response.ClassStudent;
using XEdu.Core.Entities;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassroomController : ControllerBase
{
    private readonly ClassroomService _classroomService;

    public ClassroomController(ClassroomService classroomService)
    {
        _classroomService = classroomService;
    }
    
    private long GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return long.Parse(userIdClaim ?? "0");
    }

    [HttpPost("createClass")]
    [Authorize(Roles = "TEACHER, ADMIN")]
    public async Task<ActionResult<string>> CreateClass([FromBody] CreateClass classroom)
    {
        var teacherId = GetCurrentUserId();
        var check = await _classroomService.CreateClassroomAsync(teacherId, classroom);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Create Class successfully.",
            Response = check
        });
    }

    [HttpGet("classrooms")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<PagedResult<ClassroomByIdResponse>>> GetMyClassrooms(
        [FromQuery] int page = 0,
        [FromQuery] int size = 10)
    {
        var teacherId = GetCurrentUserId();
        try
        {
            var pagedResult = await _classroomService.GetClassroomsByTeacherAsync(teacherId, page, size);
            return Ok(new ApiResponse<PagedResult<ClassroomByIdResponse>>
            {
                Success = true,
                Message = "Get my class successfully.",
                Response = pagedResult
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<PagedResult<ClassroomByIdResponse>>
            {
                Success = false,
                Message = $"Error occurred while getting classrooms: {ex.Message}",
                Response = null
            });
        }
    }
    
    [HttpGet("classroomById")]
    [Authorize(Roles = "TEACHER, ADMIN")]
    public async Task<ActionResult<ClassroomByIdResponse>> GetClassroomById([FromQuery] long classId)
    {
        var classroom = await _classroomService.GetClassroomByIdAsync(classId);
        if (classroom != null)
        {
            return Ok(new ApiResponse<ClassroomByIdResponse>
            {
                Success = true,
                Message = "Get class by id successfully.",
                Response = classroom
            });
        }
        return NotFound(new ApiResponse<ClassroomByIdResponse>
        {
            Success = false,
            Message = "Class not found.",
            Response = null
        });
    }
    
    
}