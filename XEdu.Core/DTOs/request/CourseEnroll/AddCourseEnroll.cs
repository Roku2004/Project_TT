using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.request.CourseEnroll;

public class AddCourseEnroll
{
    public long studentId { get; set; }
    public long courseId { get; set; }
    public EnrollmentType type { get; set; }
    public decimal? paidAmount { get; set; }
    public EnrollmentStatus? status { get; set; }
    public decimal progress { get; set; } = 0;
    public DateTime? completedAt { get; set; }
    public DateTime enrolledAt { get; set; } = DateTime.UtcNow;
    public DateTime updatedAt { get; set; } = DateTime.UtcNow;
}