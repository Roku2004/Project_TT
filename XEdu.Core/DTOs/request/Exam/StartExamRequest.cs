namespace XEdu.Core.DTOs.request.Exam;

public class StartExamRequest
{
    public long id { get; set; }
    public long examId { get; set; }
    public string examTitle { get; set; }
    public int duration { get; set; }
    public int totalQuestions { get; set; }
    public int attemptNumber { get; set; }
    public DateTime startedAt { get; set; }
    public string status { get; set; }
}
