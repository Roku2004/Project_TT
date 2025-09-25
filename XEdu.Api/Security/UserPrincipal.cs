using System.Security.Claims;
using XEdu.Core.Entities;
using XEdu.Core.Enums;

namespace XEdu.Api.Security;

public class UserPrincipal
{
    public long Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public Role Role { get; set; }
    public bool EmailVerified { get; set; }
    public bool Active { get; set; }
    public Dictionary<string, object> Attributes { get; set; } = new();
    
    public bool IsAccountNonLocked => Active;
    public bool IsEnabled => Active && EmailVerified;

    public List<Claim> GetClaims()
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, Id.ToString()),
            new Claim(ClaimTypes.Email, Email),
            new Claim(ClaimTypes.Name, FullName),
            new Claim(ClaimTypes.Role, $"ROLE_{Role}")
        };

        foreach (var attr in Attributes)
        {
            claims.Add(new Claim(attr.Key, attr.Value?.ToString() ?? ""));
        }

        return claims;
    }

    public ClaimsPrincipal ToClaimsPrincipal()
    {
        var identity = new ClaimsIdentity(GetClaims(), "custom");
        return new ClaimsPrincipal(identity);
    }

    public static UserPrincipal Create(User user)
    {
        return new UserPrincipal
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Password = user.Password,
            Role = user.Role,
            EmailVerified = user.EmailVerified,
            Active = user.Active
        };
    }

    public static UserPrincipal Create(User user, Dictionary<string, object> attributes)
    {
        var principal = Create(user);
        principal.Attributes = attributes;
        return principal;
    }
}
