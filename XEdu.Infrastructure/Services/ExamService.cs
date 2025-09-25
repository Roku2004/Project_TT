using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using XEdu.Core.DTOs.request.Exam;
using XEdu.Core.DTOs.request.StudentAnswer;
using XEdu.Core.DTOs.response.Answer;
using XEdu.Core.DTOs.response.Exam;
using XEdu.Core.Entities;
using XEdu.Core.Enums;
using XEdu.Core.IService;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class ExamService : IExamService
{
    private readonly IMapper _mapper;
    private readonly ExamRepository _examRepository;
    private readonly CourseRepository _courseRepository;
    private readonly UserRepository _userRepository;
    private readonly XEduDbContext _dbContext;
    private readonly StudentAnswerRepository _studentAnswerRepository;

    public ExamService(IMapper mapper, ExamRepository examRepository, CourseRepository courseRepository, UserRepository userRepository, XEduDbContext dbContext, StudentAnswerRepository studentAnswerRepository)
    {
        _mapper = mapper;
        _examRepository = examRepository;
        _courseRepository = courseRepository;
        _userRepository = userRepository;
        _dbContext = dbContext;
        _studentAnswerRepository = studentAnswerRepository;
    }

    // Teacher Role Methods
    public async Task<string> CreateExamAsync(long teacherId, CreateExam exam)
    {
        var existingCourse = await _courseRepository.GetCourseByTeacherIdAndIdAsync(teacherId, exam.courseId);
        if (existingCourse == null)
        {
            return "Course not found";
        }
        var mapExam = _mapper.Map<Exam>(exam);
        mapExam.TeacherId = teacherId;
        mapExam.TopicId = null;
        mapExam.CreatedAt = DateTime.UtcNow;
        await _examRepository.AddAsync(mapExam);
        return "Exam created successfully";
    }

    public async Task<PagedResult<ExamResponse>> GetExamsByTeacherAsync(long teacherId, int page, int size)
    {
        var teacher = await _dbContext.Users.FindAsync(teacherId);
        if (teacher == null)
            return null;

        var query = _dbContext.Exams
            .Where(e => e.TeacherId == teacherId)
            .Include(e => e.Subject)
            .Include(e => e.Grade)
            .Include(e => e.Teacher)
            .OrderByDescending(e => e.CreatedAt);

        var totalElements = await query.CountAsync();

        var exams = await query
            .Skip(page * size)
            .Take(size)
            .ProjectTo<ExamResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();

        var response = new List<ExamResponse>();

        foreach (var exam in exams)
        {
            var mapped = _mapper.Map<ExamResponse>(exam);
            response.Add(mapped);
        }

        return new PagedResult<ExamResponse>
        {
            Content = response,
            TotalElements = totalElements,
            Page = page,
            Size = size
        };
    }

    public async Task<string> publishExamAsync(long teacherId, PublishExam publishExam)
    {
        try
        {
            var existingExam = await _examRepository.GetExamByTeacherIdAndIdAsync(teacherId, publishExam.id);
            if (existingExam == null)
            {
                return "Exam not found";
            }
            
            existingExam.Status = ExamStatus.PUBLISHED;
            existingExam.UpdatedAt = DateTime.UtcNow;
            await _examRepository.UpdateAsync(existingExam);
            return "Exam published successfully";
        }
        catch (InvalidCastException ex)
        {
            return $"Data error: {ex.Message}";
        }
    }

    
    //Student Role Methods
    public async Task<PagedResult<object>> GetPublishedExamsAsync(int page, int size, long? subjectId, long? gradeId, string search)
    {
        IQueryable<Exam> query = _dbContext.Exams
            .Where(e => e.Status == ExamStatus.PUBLISHED)
            .Include(e => e.Subject)
            .Include(e => e.Grade)
            .Include(e => e.Teacher);
        
        if (subjectId.HasValue && subjectId.Value > 0)
        {
            query = query.Where(e => e.SubjectId == subjectId.Value);
        }
        
        if (gradeId.HasValue && gradeId.Value > 0)
        {
            query = query.Where(e => e.GradeId == gradeId.Value);
        }
        
        if (!string.IsNullOrEmpty(search) && !string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(e =>
                e.Title.ToLower().Contains(searchLower) ||
                (e.Description != null && e.Description.ToLower().Contains(searchLower))
            );
        }
        
        var totalElements = await query.CountAsync();
        
        var exams = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip(page * size)
            .Take(size)
            .ProjectTo<ExamResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();
        
    
        return new PagedResult<object>
        {
            Content = exams,
            TotalElements = totalElements,
            Page = page,
            Size = size,
        };
    }

    public async Task<object> ExamDetailAsync(long examId)
    {
        var exam = await _dbContext.Exams
            .Where(e => e.Id == examId && e.Status == ExamStatus.PUBLISHED)
            .Include(e => e.Subject)
            .Include(e => e.Grade)
            .Include(e => e.Teacher)
            .FirstOrDefaultAsync();
    
        if (exam == null)
        {
            return null;
        }
    
        var examDetail = _mapper.Map<ExamResponse>(exam);
        return examDetail;
    }

    public async Task<List<ExamQuestionResponse>> GetShuffledExamQuestions(long studentExamId)
    {
        var questionData = await (from se in _dbContext.StudentExams
                                 join e in _dbContext.Exams on se.ExamId equals e.Id
                                 join eq in _dbContext.ExamQuestions on e.Id equals eq.ExamId
                                 join q in _dbContext.Questions on eq.QuestionId equals q.Id
                                 join a in _dbContext.Answers on q.Id equals a.QuestionId
                                 where se.Id == studentExamId
                                 select new
                                 {
                                     QuestionId = q.Id,
                                     QuestionType = q.Type,
                                     QuestionText = q.QuestionText,
                                     Points = eq.Points,
                                     AnswerId = a.Id,
                                     AnswerText = a.AnswerText,
                                     AnswerOrderIndex = a.OrderIndex,
                                     ShuffleAnswers = e.ShuffleAnswers,
                                     ShuffleQuestions = e.ShuffleQuestions
                                 }).ToListAsync();
    
        var response = new List<ExamQuestionResponse>();
        var groupedQuestions = questionData
            .GroupBy(q => q.QuestionId).ToList();
        foreach (var group in groupedQuestions)
        {
            var questionInfo = group.First(); 
            var answers = group.Select(a => new AnswerResponse
            {
                answerId = a.AnswerId,
                answerText = a.AnswerText,
                orderIndex = a.AnswerOrderIndex
            }).ToList();

            if (questionInfo.ShuffleAnswers == true)
            {
                answers = answers.OrderBy(a => Guid.NewGuid()).ToList();
            }
            else
            {
                answers = answers.OrderBy(a => a.orderIndex).ToList();
            }
            
            response.Add(new ExamQuestionResponse
            {
                questionId = questionInfo.QuestionId,
                questionType = questionInfo.QuestionType,
                points = questionInfo.Points,
                questionText = questionInfo.QuestionText,
                answers = answers,
                questionCount = groupedQuestions.Count()
            });
            if (questionInfo.ShuffleQuestions == true)
            {
                response = response.OrderBy(q => Guid.NewGuid()).ToList();
            }
            else
            {
                response = response.OrderBy(q => q.questionId).ToList();           
            }
        }

        return response;
    }

    public async Task<string> submitAnswer(SubmitAnswerRequest submitAnswer)
    {
        var message = string.Empty;
        var studentExam = _dbContext.StudentExams.Find(submitAnswer.studentExamId);
        if (studentExam == null)
        {
            message = "Student exam not found";
            return message;
        }
        if(studentExam.Status != ExamAttemptStatus.IN_PROGRESS)
        {
            message = "Exam is not in progress";
            return message;
        }
        var question = _dbContext.Questions.Find(submitAnswer.questionId);
        if (question == null)
        {
            message = "Question not found";
            return message;
        }
        
        var studentAnswer = await _studentAnswerRepository.GetByStudentExamIdAndQuestionIdAsync(submitAnswer.studentExamId, submitAnswer.questionId);
        if (studentAnswer != null)
        {
            studentAnswer.selectedAnswer = submitAnswer.answerId;
            studentAnswer.UpdatedAt = DateTime.UtcNow;
            await _studentAnswerRepository.UpdateAsync(studentAnswer);
            message = "Answer updated successfully";
        }
        else
        {
            studentAnswer = new StudentAnswer
            {
                StudentExamId = submitAnswer.studentExamId,
                QuestionId = submitAnswer.questionId,
                selectedAnswer = submitAnswer.answerId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _studentAnswerRepository.AddAsync(studentAnswer);
            message = "Answer submitted successfully";
        }
        return message;
    }
    
}