using XEdu.Core.DTOs.response.Exam;
using XEdu.Core.Entities;

namespace XEdu.Core.IService;

public interface IStudentExamService
{
    Task<StudentExam> StartExamAsync(long examId, long studentId);
    Task<StudentExam> submitExam(long studentExamId);
    Task<List<ExamResultResponse>> GetExamResultsAsync(long studentId, long examId);
    Task<ExamResponse> GetExamId(long studentExamId);
}