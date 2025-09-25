namespace XEdu.Core.DTOs.request.StudentAnswer;

public class SubmitAnswerRequest
{
    public long studentExamId { get; set; }
    public long questionId { get; set; }
    public long answerId { get; set; }
}