using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using XEdu.Core.DTOs.request.User;
using XEdu.Core.DTOs.response.User;
using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Core.Enums;
using XEdu.Core.IService;
using XEdu.Core.Services;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly XEduDbContext _dbContext;
    private readonly IMapper _mapper;

    public UserService(UserRepository userRepository, IPasswordHasher passwordHasher, XEduDbContext dbContext, IMapper mapper)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<bool> ChangePasswordAsync(User user, string currentPassword, string newPassword)
    {
        if (!_passwordHasher.VerifyPassword(currentPassword, user.Password))
        {
            return false;
        }

        user.Password = _passwordHasher.HashPassword(newPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<bool> UpdateProfileAsync(long userId, UpdateProfileRequest request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return false;
        }
        _mapper.Map(request, user);

        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<bool> VerifyEmailAsync(User user)
    {
        user.EmailVerified = true;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
        return true;
    }

    public async Task<User?> GetUserByIdAsync(long userId)
    {
        return await _userRepository.GetByIdAsync(userId);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _userRepository.FindByEmailAsync(email);
    }

   public async Task<string> CreateUserAsync(string email, string password, string fullName)
    {
        try
        {
            User? existingUser = await _userRepository.FindByEmailAsync(email);
            if (existingUser != null)
            {
                return "User with this email already exists";
            }
        }
        catch (InvalidCastException)
        {
            return "Invalid email format";
        }
        catch (Exception ex)
        {
            return $"Error checking existing user: {ex.Message}";
        }
    
        var user = new User
        {
            Email = email,
            Password = _passwordHasher.HashPassword(password),
            FullName = fullName,
            Role = Role.STUDENT,
            Provider = AuthProvider.LOCAL,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow, // Thêm UpdatedAt
            EmailVerified = true,
            Active = true,
            ProviderId = null,  // Đảm bảo nullable fields
            Avatar = null,
            Phone = null,
            LastLogin = null
        };
    
        try
        {
            await _userRepository.AddAsync(user);
            return "User created successfully";
        }
        catch (Exception ex)
        {
            // Log chi tiết lỗi để debug
            return $"Failed to save user: {ex.InnerException?.Message ?? ex.Message}";
        }
    }

    public async Task<PagedResult<object>> GetUsersAsync(int page, int size, string role, string search)
    {
        IQueryable<User> query = _dbContext.Users;

        // Apply search filter
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(u =>
                u.FullName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                u.Email.Contains(search, StringComparison.OrdinalIgnoreCase));
        }
        // Apply role filter
        else if (!string.IsNullOrEmpty(role))
        {
            if (Enum.TryParse<Role>(role, true, out var parsedRole))
            {
                query = query.Where(u => u.Role == parsedRole);
            }
            else
            {
                throw new ArgumentException("Invalid role");
            }
        }

        var totalElements = await query.CountAsync();
        var users = await query
            .Skip(page * size)
            .Take(size)
            .ProjectTo<UserProfileByAdmin>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return new PagedResult<object>
        {
            Content = users,
            TotalElements = totalElements,
            Page = page,
            Size = size
        };
    }

    public async Task<bool> UpdateLastLoginAsync(long userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user != null)
        {
            user.LastLogin = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);
            return true;
        }
        return false;
    }
}