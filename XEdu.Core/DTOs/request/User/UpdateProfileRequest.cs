namespace XEdu.Core.DTOs.request.User;

public class UpdateProfileRequest
{
        public string phone { get; set; } = string.Empty;
        public string fullName { get; set; } = string.Empty;
        public string? avatar { get; set; }
        
        public DateTime updatedAt { get; set; } = DateTime.UtcNow;
}