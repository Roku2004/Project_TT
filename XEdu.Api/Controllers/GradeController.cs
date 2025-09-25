using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.response.Grade;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GradeController : ControllerBase
{
    private readonly GradeService _gradeService;

    public GradeController(GradeService gradeService)
    {
        _gradeService = gradeService;
    }

    [HttpGet("grades")]
    [Authorize(Roles = "TEACHER,STUDENT,ADMIN")]
    public async Task<ActionResult<List<GradeResponse>>> GetAllGrades()
    {
        List<GradeResponse> grades = await _gradeService.GetGradesAsync();
        if (grades != null)
        {
            return Ok(new ApiResponse<List<GradeResponse>>
            {
                Success = true,
                Message = "Found grade successfully.",
                Response = grades
            });
        }
        return NotFound(new ApiResponse<List<GradeResponse>>
        {
            Success = false,
            Message = "No grades found.",
            Response = null
        });
    }
}