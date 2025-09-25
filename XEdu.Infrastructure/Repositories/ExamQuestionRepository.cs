using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class ExamQuestionRepository : Repository<ExamQuestion>
{
    public ExamQuestionRepository(XEduDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ExamQuestion>> FindByExamIdOrderByOrderIndexAsync(long examId)
    {
        return await _context.ExamQuestions
            .Where(eq => eq.ExamId == examId)
            .Include(eq => eq.Question)
            .ThenInclude(q => q.Answers)
            .Include(eq => eq.Exam)
            .OrderBy(eq => eq.OrderIndex)
            .ToListAsync();
    }

}