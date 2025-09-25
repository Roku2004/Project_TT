using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.request.Exam;
using XEdu.Core.DTOs.request.StudentAnswer;
using XEdu.Core.DTOs.response.Exam;
using XEdu.Core.Entities;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExamController : ControllerBase
{
    private readonly ExamService _examService;
    private readonly IMapper _mapper;
    private readonly StudentExamService _studentExamService;

    public ExamController(ExamService examService, IMapper mapper, StudentExamService studentExamService)
    {
        _examService = examService;
        _mapper = mapper;
        _studentExamService = studentExamService;
    }

    private long GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return long.Parse(userIdClaim ?? "0");
    }

    [HttpPost("createExam")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> CreateExam([FromBody] CreateExam createExam)
    {
        var teacherId = GetCurrentUserId();
        var result = await _examService.CreateExamAsync(teacherId, createExam);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Create exam successfully.",
            Response = result
        });
    }

    [HttpGet("exams")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<PagedResult<ExamResponse>>> GetExamsByTeacher([FromQuery] int page = 0,
        [FromQuery] int size = 10)
    {
        var teacherId = GetCurrentUserId();
        try
        {
            var pagedResult = await _examService.GetExamsByTeacherAsync(teacherId, page, size);
            if (pagedResult != null)
            {
                return Ok(new ApiResponse<PagedResult<ExamResponse>>
                {
                    Success = true,
                    Message = "Found exam successfully.",
                    Response = pagedResult
                });
            }

            return NotFound(new ApiResponse<PagedResult<ExamResponse>>
            {
                Success = false,
                Message = "No exams found for this teacher.",
                Response = null
            });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("publishExam")]
    [Authorize(Roles = "TEACHER")]
    public async Task<ActionResult<string>> PublishExam([FromBody] PublishExam publishExam)
    {
        var teacherId = GetCurrentUserId();
        if (publishExam.id <= 0)
        {
            return BadRequest("Invalid exam ID.");
        }

        var result = await _examService.publishExamAsync(teacherId, publishExam);
        return Ok(new ApiResponse<string>
        {
            Success = true,
            Message = "Published exam successfully.",
            Response = result
        });
    }

    [HttpGet("getAllExams")] // chưa đc hs đăng ký
    public async Task<ActionResult<PagedResult<object>>> GetAllExams([FromQuery] long subjectId,
        [FromQuery] long gradeId,
        [FromQuery] string? search = null,
        [FromQuery] int page = 0,
        [FromQuery] int size = 12)
    {
        try
        {
            var pagedResult = await _examService.GetPublishedExamsAsync(page, size, subjectId, gradeId, search);
            if (pagedResult != null)
            {
                return Ok(new ApiResponse<PagedResult<object>>
                {
                    Success = true,
                    Message = "Found all exams successfully.",
                    Response = pagedResult
                });
            }

            return NotFound(new ApiResponse<PagedResult<object>>
            {
                Success = false,
                Message = "No exams found.",
                Response = null
            });
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Role Student
    [HttpGet("getExamById")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<string>> GetExamById([FromQuery] long studentExamId)
    {
        var examDetail = await _studentExamService.GetExamId(studentExamId);
        if (examDetail == "Student exam not found")
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = "Student exam not found",
                Response = null
            });
        }
       return Ok(new ApiResponse<string>
       {
           Success = true,
           Message = "Get exam ID successfully.",
           Response = examDetail
       });
    }

    [HttpPost("startExam")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<StartExamRequest>> StartExam([FromForm] string examId)
    {
        var studentId = GetCurrentUserId();
        long examIdLong = long.Parse(examId);
        if (examIdLong <= 0)
        {
            return BadRequest(new ApiResponse<StartExamRequest>
            {
                Success = false,
                Message = "Invalid exam ID.",
                Response = null
            });
        }

        try
        {
            var studentExam = await _studentExamService.StartExamAsync(examIdLong, studentId);
            var response = _mapper.Map<StartExamRequest>(studentExam);

            return Ok(new ApiResponse<StartExamRequest>
            {
                Success = true,
                Message = "Exam started successfully.",
                Response = response
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message,
                Response = null
            });
        }
    }

    [HttpGet("attempt/questions")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<List<ExamQuestionResponse>>> GetShuffledExamQuestions([FromQuery] long studentExamId)
    {
        var studentId = GetCurrentUserId();

        if (studentExamId <= 0)
        {
            return BadRequest(new ApiResponse<List<ExamQuestionResponse>>
            {
                Success = false,
                Message = "Invalid student exam ID.",
                Response = null
            });
        }

        try
        {
            List<ExamQuestionResponse> questions = await _examService.GetShuffledExamQuestions(studentExamId);

            return Ok(new ApiResponse<List<ExamQuestionResponse>>
            {
                Success = true,
                Message = "Questions retrieved successfully.",
                Response = questions
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<List<ExamQuestionResponse>>
            {
                Success = false,
                Message = ex.Message,
                Response = null
            });
        }
    }

    [HttpPost("attempt/answer")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<string>> SubmitAnswer([FromBody] SubmitAnswerRequest request)
    {
        var studentId = GetCurrentUserId();
        var submitResult = await _examService.submitAnswer(request);
        if (submitResult == "Answer submitted successfully" || submitResult == "Answer updated successfully")
        {
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Response = submitResult
            });
        }
        else
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Response = null
            });
        }
    }

    [HttpPost("attempt/submit")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<StudentExam>> SubmitExam([FromForm] long studentExamId)
    {
        if (studentExamId <= 0)
        {
            return BadRequest(new ApiResponse<StudentExam>
            {
                Success = false,
                Message = "Invalid student exam ID.",
                Response = null
            });
        }

        try
        {
            var result = await _studentExamService.submitExam(studentExamId);
            var examResult = _mapper.Map<ExamResultResponse>(result);
            return Ok(new ApiResponse<ExamResultResponse>
            {
                Success = true,
                Message = "Exam submitted successfully.",
                Response = examResult
            });

        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message,
                Response = null
            });
        }
    }

    [HttpGet("attempt/allResult")]
    [Authorize(Roles = "STUDENT")]
    public async Task<ActionResult<ExamResultResponse>> GetExamResult([FromQuery] long examId)
    {
        var studentId = GetCurrentUserId();
        if (examId <= 0)
        {
            return BadRequest(new ApiResponse<ExamResultResponse>
            {
                Success = false,
                Message = "Invalid student exam ID.",
                Response = null
            });
        }

        try
        {
            List<ExamResultResponse> results = await _studentExamService.GetExamResultsAsync(studentId, examId);
            if (results != null)
            {
                return Ok(new ApiResponse<List<ExamResultResponse>>
                {
                    Success = true,
                    Message = "Exam results retrieved successfully.",
                    Response = results
                });
            }
            return NotFound(new ApiResponse<List<ExamResultResponse>>
            {
                Success = false,
                Message = "No exam results found for this student and exam.",
                Response = null
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = ex.Message,
                Response = null
            });
        }
    }
}