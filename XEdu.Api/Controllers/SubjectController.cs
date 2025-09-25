using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.response.Subject;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubjectController : ControllerBase
{
    private readonly SubjectService _subjectService;

    public SubjectController(SubjectService subjectService)
    {
        _subjectService = subjectService;
    }

    [HttpGet("subjects")]
    [Authorize(Roles = "TEACHER,STUDENT,ADMIN")]
    public async Task<ActionResult<List<SubjectResponse>>> GetAllSubjects()
    {
        List<SubjectResponse> subjects = await _subjectService.GetAllSubjectsAsync();
        if (subjects != null)
        {
            return Ok(new ApiResponse<List<SubjectResponse>>
            {
                Success = true,
                Message = "Found subjects successfully.",
                Response = subjects
            });
        }
        return NotFound(new ApiResponse<List<SubjectResponse>>
        {
            Success = false,
            Message = "No subjects found.",
            Response = null
        });
    }
    
}