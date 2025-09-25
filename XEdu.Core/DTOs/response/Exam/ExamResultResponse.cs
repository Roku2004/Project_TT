namespace XEdu.Core.DTOs.response.Exam;

public class ExamResultResponse
{
    public long id { get; set; }
    public decimal score { get; set; }
    public bool passed { get; set; }
    public DateTime submittedAt { get; set; }
    public string status { get; set; } = string.Empty;
}