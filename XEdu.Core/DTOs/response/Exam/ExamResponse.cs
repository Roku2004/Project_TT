namespace XEdu.Core.DTOs.response.Exam;

public class ExamResponse
{
    public long id { get; set; }
    public string title { get; set; } = string.Empty;
    public string description { get; set; } = string.Empty;
    public int duration { get; set; }
    public int totalQuestions { get; set; }
    public decimal passingScore { get; set; }
    public string subjectName { get; set; } = string.Empty;
    public string gradeName { get; set; } = string.Empty;
    public string fullName { get; set; }
    public string status { get; set; } = string.Empty;
    public DateTime createdAt { get; set; }
}