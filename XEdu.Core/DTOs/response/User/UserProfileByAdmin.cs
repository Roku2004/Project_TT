using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.response.User;

public class UserProfileByAdmin
{
    public string FullName { get; set; } = string.Empty;
    public Role Role { get; set; }
    public bool Active { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; } 
}