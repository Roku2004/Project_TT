namespace XEdu.Core.DTOs.request.Exam;

public class CreateExam
{
    public long courseId { get; set; }
    public long subjectId { get; set; }
    public string title { get; set; } = string.Empty;
    public string? description { get; set; }
    public int duration { get; set; } // Duration in minutes
    public int totalQuestions { get; set; }
    public decimal passingScore { get; set; }
    public bool shuffleQuestions { get; set; }
    public bool shuffleAnswers { get; set; }
    public bool allowRetake { get; set; }
    public int maxAttempts { get; set; } 
    public int gradeId { get; set; } // Grade level for the exam
}