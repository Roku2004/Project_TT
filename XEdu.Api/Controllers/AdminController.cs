// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using XEdu.Core.Enums;
// using XEdu.Infrastructure.Services;
//
// namespace XEdu.Api.Controllers;
//
// [ApiController]
// [Authorize(Roles = "ADMIN")]
// [Route("api/[controller]")]
// public class AdminController : ControllerBase
// {
//     private readonly UserService _userService;
//     private readonly CourseService _courseService;
//     private readonly SubjectService _subjectService;
//
//     public AdminController(UserService userService, CourseService courseService, SubjectService subjectService)
//     {
//         _userService = userService;
//         _courseService = courseService;
//         _subjectService = subjectService;
//     }
//
//     [HttpGet("users")]
//     public async Task<ActionResult<object>> GetAllUsers(
//         [FromQuery] int page = 0,
//         [FromQuery] int size = 20,
//         [FromQuery] string role = null,
//         [FromQuery] string search = null)
//     {
//         try
//         {
//             var result = await _userService.GetUsersAsync(page, size, role, search);
//             return Ok(result);
//         }
//         catch (ArgumentException ex)
//         {
//             return BadRequest(ex.Message);
//         }
//     }
//     
//     [HttpGet("courses")]
//     public async Task<ActionResult<object>> GetAllCourses(
//         [FromQuery] int page = 0,
//         [FromQuery] int size = 20,
//         [FromQuery] string status = null)
//     {
//         var result = await _courseService.GetCoursesAsync(page, size, status);
//         return Ok(result);
//     }
//     
//     [HttpPut("courses/{courseId}/status")]
//     public async Task<ActionResult<object>> UpdateCourseStatus(
//         [FromRoute] long courseId,
//         [FromBody] Dictionary<string, string> request)
//     {
//         try
//         {
//             if (!request.TryGetValue("status", out string status))
//             {
//                 return BadRequest(new { message = "Missing 'status' in request body" });
//             }
//     
//             if (!Enum.TryParse<CourseStatus>(status, true, out var courseStatus))
//             {
//                 return BadRequest(new { message = "Invalid status value" });
//             }
//     
//             var success = await _courseService.UpdateStatusAsync(courseId, courseStatus);
//             
//             if (!success)
//             {
//                 return NotFound(new { message = "Course not found" });
//             }
//     
//             return Ok(new { message = "Course status updated successfully" });
//         }
//         catch (Exception ex)
//         {
//             return StatusCode(500, new { message = "Internal server error" });
//         }
//     }
//     
//     
//
// }