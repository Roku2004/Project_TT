using System.ComponentModel.DataAnnotations;

namespace XEdu.Core.DTOs.request.Auth;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string password { get; set; } = string.Empty;
}