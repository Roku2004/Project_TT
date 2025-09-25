using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.request.User;
using XEdu.Core.DTOs.response.User;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "STUDENT,TEACHER,ADMIN")]
public class ProfileController : ControllerBase
{
    private readonly UserService _userService;
    private readonly IMapper _mapper;

    public ProfileController(IMapper mapper, UserService userService)
    {
        _mapper = mapper;
        _userService = userService;
    }
    
    private long GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return long.Parse(userIdClaim ?? "0");
    }

    [HttpGet("profile")]
    public async Task<ActionResult<ApiResponse<UserProfileResponse>>> GetCurrentUser()
    {
        var userId = GetCurrentUserId();
        var user = await _userService.GetUserByIdAsync(userId);

        if (user == null)
        {
            return NotFound(new ApiResponse<UserProfileResponse>
            {
                Success = false,
                Message = "Not found user.",
                Response = null
            });
        }

        var userSummary = _mapper.Map<UserProfileResponse>(user);

        return Ok(new ApiResponse<UserProfileResponse>
        {
            Success = true,
            Message = "Get profile successfully.",
            Response = userSummary
        });
    }
    
    [HttpPut("update-profile")]
    public async Task<ActionResult<ApiResponse<bool>>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = GetCurrentUserId();
        try
        {
            var updateResult = await _userService.UpdateProfileAsync(userId, request);
            if (updateResult)
            {
                return Ok(new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Update profile successfully.",
                    Response = updateResult
                });
            }

            return BadRequest(new ApiResponse<bool>
            {
                Success = false,
                Message = "Update profile fails.",
                Response = false
            });
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
    
}