using System.Security.Claims;
using XEdu.Infrastructure.Services;

namespace XEdu.Api.Security;

public class JwtAuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public JwtAuthenticationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, JwtTokenProvider tokenProvider, UserService userService)
    {
        var token = GetJwtFromRequest(context.Request);

        if (!string.IsNullOrEmpty(token) && tokenProvider.ValidateToken(token))
        {
            var userId = tokenProvider.GetUserIdFromToken(token);
            if (userId.HasValue)
            {
                var userDetails = await userService.GetUserByIdAsync(userId.Value);
                if (userDetails != null)
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()),
                        new Claim("email", userDetails.Email),
                        new Claim(ClaimTypes.Role, userDetails.Role.ToString())
                    };

                    var identity = new ClaimsIdentity(claims, "jwt");
                    var principal = new ClaimsPrincipal(identity);

                    context.User = principal;
                }
            }
        }

        await _next(context);
    }

    private string? GetJwtFromRequest(HttpRequest request)
    {
        if (request.Headers.TryGetValue("Authorization", out var authHeader) &&
            authHeader.ToString().StartsWith("Bearer "))
        {
            return authHeader.ToString().Substring(7);
        }

        return null;
    }
}