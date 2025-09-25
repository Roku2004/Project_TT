using XEdu.Core.DTOs.request.User;
using XEdu.Core.Entities;

namespace XEdu.Core.IService;

public interface IUserService
{
    Task<bool> ChangePasswordAsync(User user, string currentPassword, string newPassword);
    Task<bool> UpdateProfileAsync(long userId, UpdateProfileRequest request);
    Task<bool> VerifyEmailAsync(User user);
    Task<User?> GetUserByIdAsync(long userId);
    Task<User?> GetUserByEmailAsync(string email);
    Task<string> CreateUserAsync(string email, string password, string fullName);
    Task<PagedResult<object>> GetUsersAsync(int page, int size, string role, string search);
    Task<bool> UpdateLastLoginAsync(long userId);
}