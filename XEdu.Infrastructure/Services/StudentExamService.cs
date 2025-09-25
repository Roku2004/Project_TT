using AutoMapper;
using Microsoft.EntityFrameworkCore;
using XEdu.Core.DTOs.response.Exam;
using XEdu.Core.Entities;
using XEdu.Core.Enums;
using XEdu.Core.IService;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class StudentExamService : IStudentExamService
{
    private readonly ExamRepository _examRepository;
    private readonly StudentExamRepository _studentExamRepository;
    private readonly XEduDbContext _dbContext; 
    private readonly ExamQuestionRepository _examQuestionRepository;
    private readonly StudentAnswerRepository _studentAnswerRepository;
    private readonly AnswerRepository _answerRepository;
    private readonly IMapper _mapper;

    public StudentExamService(
        ExamRepository examRepository, 
        StudentExamRepository studentExamRepository, 
        XEduDbContext dbContext, 
        ExamQuestionRepository examQuestionRepository, StudentAnswerRepository studentAnswerRepository, AnswerRepository answerRepository, IMapper mapper)
    {
        _examRepository = examRepository;
        _studentExamRepository = studentExamRepository;
        _dbContext = dbContext;
        _examQuestionRepository = examQuestionRepository;
        _studentAnswerRepository = studentAnswerRepository;
        _answerRepository = answerRepository;
        _mapper = mapper;
    }

    public async Task<StudentExam> StartExamAsync(long examId, long studentId)
    {
        var exam = await _examRepository.FindByIdAsync(examId)
                   ?? throw new Exception($"Exam not found with id: {examId}");

        if (exam.Status != ExamStatus.PUBLISHED)
            throw new Exception("Exam is not available");

        if (exam.StartTime.HasValue && DateTime.UtcNow < exam.StartTime.Value)
            throw new Exception("Exam has not started yet");

        if (exam.EndTime.HasValue && DateTime.UtcNow > exam.EndTime.Value)
            throw new Exception("Exam has ended");

        var existingAttempts = await _studentExamRepository
            .FindByStudentIdAndExamIdAsync(studentId, examId);

        if (!exam.AllowRetake && existingAttempts.Any())
            throw new Exception("Retake not allowed for this exam");

        if (existingAttempts.Count() >= exam.MaxAttempts)
            throw new Exception("Maximum attempts exceeded");

        var examQuestions = await _examQuestionRepository
            .FindByExamIdOrderByOrderIndexAsync(examId);

        string questionOrder;
        if (exam.ShuffleQuestions)
        {
            var shuffled = examQuestions.OrderBy(q => Guid.NewGuid()).ToList();
            questionOrder = string.Join(",", shuffled.Select(q => q.Question.Id));
        }
        else
        {
            questionOrder = string.Join(",", examQuestions.Select(q => q.Question.Id));
        }

        var studentExam = new StudentExam
        {
            StudentId = studentId,  // Chỉ set foreign key ID
            ExamId = examId,        // Chỉ set foreign key ID
            AttemptNumber = existingAttempts.Count() + 1,
            StartedAt = DateTime.UtcNow,
            Status = ExamAttemptStatus.IN_PROGRESS,
            QuestionOrder = questionOrder,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await _studentExamRepository.AddAsync(studentExam);
        await _dbContext.SaveChangesAsync();

        // Load navigation properties sau khi save
        await _dbContext.Entry(studentExam)
            .Reference(x => x.Exam)
            .LoadAsync();
        
        return studentExam;
    }

    public async Task<StudentExam> submitExam(long studentExamId)
    {
        var studentExam = await _dbContext.StudentExams
            .Include(se => se.Exam)
            .FirstOrDefaultAsync(se => se.Id == studentExamId);
        if (studentExam == null)
        {
            throw new Exception("Student exam not found");
        }
        if (studentExam.Status != ExamAttemptStatus.IN_PROGRESS)
        {
            throw new Exception("Exam is not in progress");
        }
        studentExam.Status = ExamAttemptStatus.SUBMITTED;
        studentExam.SubmittedAt = DateTime.UtcNow;
        studentExam.UpdatedAt = DateTime.UtcNow;
        grade(studentExamId);
        await _studentExamRepository.UpdateAsync(studentExam);
        return studentExam;
    }

    public async Task<List<ExamResultResponse>> GetExamResultsAsync(long studentId, long examId)
    {
        var results = await _studentExamRepository.FindByStudentIdAndExamIdAsync(studentId, examId);
        if (results == null || !results.Any())
        {
            throw new Exception("No exam results found for the given student and exam");
        }
        var mappedResults = _mapper.Map<List<ExamResultResponse>>(results);
        return mappedResults;
    }

    public async Task<ExamResponse> GetExamId(long studentExamId)
    {
        var studentExam = await _studentExamRepository.GetByIdAsync(studentExamId);
        if (studentExam == null)
        {
            return null;
        }
        var exam = await _examRepository.GetByIdAsync(studentExam.ExamId);
        return _mapper.Map<ExamResponse>(exam);;
    }


    void grade(long studentExamId)
    {
        var message = String.Empty;
        var studentExam = _dbContext.StudentExams
            .Include(se => se.Exam)
            .FirstOrDefault(x => x.Id == studentExamId);
        if (studentExam == null)
        {
            message = "Student exam not found";
            Console.WriteLine(message);
        }
        List<StudentAnswer> studentAnswers = _dbContext.StudentAnswers.Where(x => x.StudentExamId == studentExamId)
            .Include(studentAnswer => studentAnswer.Question).ToList();
        decimal totalScore = 0;
        decimal maxPossibleScore = 0;
        foreach (var answer in studentAnswers)
        {
            var question = answer.Question;
            maxPossibleScore += question.Points;

            if (question.Type == QuestionType.MULTIPLE_CHOICE || question.Type == QuestionType.TRUE_FALSE)
            {
                if (answer.selectedAnswer.HasValue)
                {
                    Answer? selectedAnswer = _dbContext.Answers
                        .FirstOrDefault(a => a.Id == answer.selectedAnswer.Value );
                    if (selectedAnswer != null && selectedAnswer.IsCorrect)
                    {
                        totalScore += question.Points;
                        answer.PointsEarned = question.Points;
                    }
                    else
                    {
                        answer.PointsEarned = 0;
                    }
                }
                else
                {
                    answer.PointsEarned = 0;
                }
            }
        }
        decimal scorePercent = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) : 0;

        if (studentExam != null)
        {
            studentExam.Score = scorePercent;
            studentExam.Passed = scorePercent >= studentExam.Exam.PassingScore;
            studentExam.Status = ExamAttemptStatus.GRADED;
            studentExam.UpdatedAt = DateTime.UtcNow;
            
            _dbContext.SaveChanges();
        }
    }
}