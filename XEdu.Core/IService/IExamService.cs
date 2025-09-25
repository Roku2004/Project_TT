using XEdu.Core.DTOs.request.Exam;
using XEdu.Core.DTOs.request.StudentAnswer;
using XEdu.Core.DTOs.response.Exam;
using XEdu.Core.Entities;

namespace XEdu.Core.IService;

public interface IExamService
{
    // Teacher role
    Task<string> CreateExamAsync(long teacherId, CreateExam exam);
    Task<PagedResult<ExamResponse>> GetExamsByTeacherAsync(long teacherId, int page, int size);
    Task<string> publishExamAsync(long teacherId, PublishExam publishExam);

    // Student role
    Task<PagedResult<object>> GetPublishedExamsAsync(int page, int size, long? subjectId, long? gradeId, string search);
    Task<object> ExamDetailAsync(long examId);
    Task<List<ExamQuestionResponse>> GetShuffledExamQuestions(long studentExamId);
    Task<string> submitAnswer(SubmitAnswerRequest studentAnswer);
}
