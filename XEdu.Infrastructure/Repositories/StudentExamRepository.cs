using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class StudentExamRepository : Repository<StudentExam>
{
    public StudentExamRepository(XEduDbContext context) : base(context)
    {
    }

    public async Task<List<StudentExam>> FindByStudentIdAndExamIdAsync(long studentId, long examId)
    {
        return await _context.StudentExams
            .Where(c => c.ExamId == examId && c.StudentId == studentId)
            .ToListAsync();
    }

}