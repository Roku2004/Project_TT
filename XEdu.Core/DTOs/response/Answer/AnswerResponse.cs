namespace XEdu.Core.DTOs.response.Answer;

public class AnswerResponse
{
    public long answerId { get; set; }
    public string answerText { get; set; } = string.Empty;
    public int orderIndex { get; set; }
}