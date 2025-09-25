using XEdu.Core.DTOs.response.Answer;
using XEdu.Core.Enums;

namespace XEdu.Core.DTOs.response.Exam;

public class ExamQuestionResponse
{
    public long questionId { get; set; }
    public QuestionType questionType { get; set; }
    public decimal points { get; set; }
    public string questionText { get; set; } = string.Empty;
    public List<AnswerResponse> answers { get; set; } = new List<AnswerResponse>();
    public int questionCount { get; set; }
}