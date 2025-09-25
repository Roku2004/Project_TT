using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;
    using Microsoft.IdentityModel.Tokens;
    using XEdu.Core.Enums;
    
    namespace XEdu.Api.Security;
    
    public class JwtTokenProvider
    {
        private readonly string _jwtSecret;
        private readonly long _jwtExpirationInMs;
    
        public JwtTokenProvider(string jwtSecret, long jwtExpirationInMs)
        {
            _jwtSecret = jwtSecret;
            _jwtExpirationInMs = jwtExpirationInMs;
        }
    
        public JwtTokenProvider(IConfiguration configuration)
        {
            _jwtSecret = configuration["Jwt:Secret"] ?? "myVerySecureSecretKeyThatIs256BitsLongForJWTTokenGenerationAndShouldBeAtLeast32Characters";
            _jwtExpirationInMs = configuration.GetValue<long>("Jwt:ExpirationInMs", 86400000); // Default 24 hours
        }
    
        private SymmetricSecurityKey GetSigningKey()
        {
            return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
        }
    
        public string GenerateToken(long userId, string email, Role role)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim("email", email),
                new Claim("role", role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
    
            var credentials = new SigningCredentials(GetSigningKey(), SecurityAlgorithms.HmacSha256);
            var expiration = DateTime.UtcNow.AddMilliseconds(_jwtExpirationInMs);
    
            var token = new JwtSecurityToken(
                claims: claims,
                expires: expiration,
                signingCredentials: credentials
            );
    
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    
        public ClaimsPrincipal? GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParams = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = GetSigningKey()
            };
    
            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParams, out _);
                return principal;
            }
            catch
            {
                return null;
            }
        }
    
        public long? GetUserIdFromToken(string token)
        {
            var principal = GetPrincipalFromToken(token);
            var idClaim = principal?.FindFirst(JwtRegisteredClaimNames.Sub);
            return idClaim != null ? long.Parse(idClaim.Value) : null;
        }
    
        public string? GetUserEmailFromToken(string token)
        {
            var principal = GetPrincipalFromToken(token);
            return principal?.FindFirst("email")?.Value;
        }
    
        public Role? GetUserRoleFromToken(string token)
        {
            var principal = GetPrincipalFromToken(token);
            var roleString = principal?.FindFirst("role")?.Value;
            return roleString != null ? Enum.Parse<Role>(roleString) : null;
        }
    
        public bool ValidateToken(string token)
        {
            return GetPrincipalFromToken(token) != null;
        }
    }