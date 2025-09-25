namespace XEdu.Core.Services;

public interface IPasswordHasher
{
    bool VerifyPassword(string password, string hashedPassword);
    string HashPassword(string password);
}