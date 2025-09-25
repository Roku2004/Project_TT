namespace XEdu.Core.DTOs.response.CourseEnrollment;

public class CourseByStudentId
{
    public long id { get; set; }
    public long studentId { get; set; }
    public long courseId { get; set; }
    public string teacherId { get; set; }
    public string courseName { get; set; }
    public string courseDescription { get; set; }
    public string courseLevel { get; set; }
    public string? courseImage { get; set; }
    public string type { get; set; }
    // public decimal? paidAmount { get; set; }
    public string? status { get; set; }
    public decimal progress { get; set; }
    public DateTime? enrolledAt { get; set; }
    public int lessonCompleted { get; set; }
}