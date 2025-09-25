using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class StudentAnswerRepository : Repository<StudentAnswer>
{
    public StudentAnswerRepository(XEduDbContext context) : base(context)
    {
    }

    public async Task<StudentAnswer?> GetByStudentExamIdAndQuestionIdAsync(long studentExamId, long questionId)
    {
        return await _context.StudentAnswers
            .FirstOrDefaultAsync(sa => sa.StudentExamId == studentExamId && sa.QuestionId == questionId );
    }
}
