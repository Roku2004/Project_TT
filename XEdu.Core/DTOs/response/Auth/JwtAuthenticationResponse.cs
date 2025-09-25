using XEdu.Core.DTOs.response.User;

namespace XEdu.Core.DTOs.response.Auth;

public class JwtAuthenticationResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = "Bearer";
    public UserInfoLogin User { get; set; } = null!;
    
}