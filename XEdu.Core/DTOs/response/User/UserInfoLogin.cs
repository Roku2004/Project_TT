using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.response.User;

public class UserInfoLogin
{
    public long id { get; set; }
    public string email { get; set; } = string.Empty;
    public string fullName { get; set; } = string.Empty;
    public string role { get; set; } = string.Empty;
}