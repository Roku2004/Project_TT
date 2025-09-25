using XEdu.Core.Services;

namespace XEdu.Infrastructure.Services;

public class BCryptPasswordHasher : IPasswordHasher
{
    public bool VerifyPassword(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
}