using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.response.ClassStudent;

public class ClassStudent
{
    public long id { get; set; }
    public long classId { get; set; }
    public long studentId { get; set; }
    public string studentName { get; set; } = string.Empty;
    public string studentEmail { get; set; } = string.Empty;
    public Role role { get; set; } = Role.STUDENT;
    public DateTime joinedAt { get; set; }
}