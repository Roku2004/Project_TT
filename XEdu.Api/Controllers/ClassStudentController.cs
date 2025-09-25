using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.request.Classroom;
using XEdu.Core.DTOs.response.ClassStudent;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassStudentController : ControllerBase
{
    private readonly ClassStudentService _classStudentService;

    public ClassStudentController(ClassStudentService classStudentService)
    {
        _classStudentService = classStudentService;
    }

    private long GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return long.Parse(userIdClaim ?? "0");
    }

    [HttpPost("addStudent")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> AddStudentToClassroom([FromBody] AddStudent addStudent)
    {
        var teacherId = GetCurrentUserId();
        var result = await _classStudentService.AddStudentToClassroomAsync(teacherId, addStudent);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Add Students successfully.",
            Response = result
        });
    }

    [HttpGet("studentsInClass")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<List<ClassStudent>>> GetStudentsInClass([FromQuery] long classId)
    {
        if (classId <= 0)
        {
            return BadRequest("Invalid class ID.");
        }

        var students = await _classStudentService.GetStudentsByClassroomIdAsync(classId);
        if (students == null || students.Count == 0)
        {
            return Ok(new ApiResponse<List<ClassStudent>>
            {
                Success = true,
                Message = "No students found in this class.",
                Response = null
            });
        }

        return Ok(new ApiResponse<List<ClassStudent>>
        {
            Success = true,
            Message = "Students retrieved successfully.",
            Response = students
        });
    }

    [HttpDelete("removeStudent")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> RemoveStudentFromClassroom([FromQuery] long classId,
        [FromQuery] long studentId)
    {
        var teacherId = GetCurrentUserId();
        if (classId <= 0 || studentId <= 0)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = "Invalid class ID or student ID.",
                Response = null
            });
        }

        var result = await _classStudentService.RemoveStudentFromClassroomAsync(teacherId, classId, studentId);
        if (result.Equals("Student removed successfully"))
        {
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Response = result
            });
        }
        return NotFound(new ApiResponse<string>
        {
            Success = false,
            Response = result
        });
    }
}