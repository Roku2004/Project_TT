using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.response.User;

public class UserProfileResponse
{
    public long Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public Role Role { get; set; }
    public string? Avatar { get; set; }
    public string Phone { get; set; } = string.Empty;
    public bool Active { get; set; }
    public DateTime CreatedAt { get; set; }
}