using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XEdu.Api.Security;
using XEdu.Core.DTOs;
using XEdu.Core.DTOs.request.Auth;
using XEdu.Core.DTOs.request.User;
using XEdu.Core.DTOs.response.Auth;
using XEdu.Core.DTOs.response.User;
using XEdu.Core.Entities;
using XEdu.Core.Enums;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly BCryptPasswordHasher _passwordHasher;
    private readonly IMapper _mapper;
    private readonly JwtTokenProvider _jwtTokenProvider;

    public AuthController(
        UserService userService,
        BCryptPasswordHasher passwordHasher,
        JwtTokenProvider jwtTokenProvider, 
        IMapper mapper)
    {
        _userService = userService;
        _passwordHasher = passwordHasher;
        _jwtTokenProvider = jwtTokenProvider;
        _mapper = mapper;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<JwtAuthenticationResponse>>> Login([FromBody] LoginRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.email);
        if (user == null || !user.Active || !_passwordHasher.VerifyPassword(request.password, user.Password))
        {
            return BadRequest(new ApiResponse<JwtAuthenticationResponse>
            {
                Success = false,
                Message = "Invalid email or password.",
                Response = null
            });
        }

        await _userService.UpdateLastLoginAsync(user.Id);

        var token = _jwtTokenProvider.GenerateToken(user.Id, user.Email, user.Role);

        var response = new JwtAuthenticationResponse
        {
            AccessToken = token,
            User = _mapper.Map<UserInfoLogin>(user)
        };
        return Ok(ApiResponse<JwtAuthenticationResponse>.SuccessResult(response, "Login successful"));
    }


    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<String>>> Register([FromBody] RegisterRequest request)
    {
        String email = request.Email;
        String fullName = request.FullName;
        String password = request.Password;
        if (email == null || fullName == null || password == null)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = "Email, full name, and password are required.",
                Response = null
            });
        }

        var createdUser = await _userService.CreateUserAsync(email, password, fullName);
        if (createdUser == null)
        {
            return BadRequest(new ApiResponse<string>
            {
                Success = false,
                Message = "User creation failed. User with this email already exists.",
                Response = null
            });
        }

        var response = new ApiResponse<string>
        {
            Success = true,
            Message = "Registration successful",
            Response = createdUser
        };
        return Ok(response);
    }

    [HttpGet("test")]
    public ActionResult<ApiResponse<string>> Test()
    {
        return Ok(ApiResponse<string>.SuccessResult("API is working!", "Health check successful"));
    }


    private long GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return long.Parse(userIdClaim ?? "0");
    }
}