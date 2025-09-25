using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class ExamRepository : Repository<Exam>
{
    public ExamRepository(XEduDbContext context) : base(context)
    {
    }

    public async Task<Exam?> GetExamByTeacherIdAndIdAsync(long teacherId, long examId)
    {
        return await _context.Exams
            .FirstOrDefaultAsync(c => c!.Id == examId && c.TeacherId == teacherId);
    }

    public async Task<Exam> FindByIdAsync(long examId)
    {
        return await _context.Exams.FirstOrDefaultAsync(c => c!.Id == examId);
    }
}