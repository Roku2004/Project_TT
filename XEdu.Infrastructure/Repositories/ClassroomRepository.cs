using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class ClassroomRepository : Repository<Classroom>
{
    public ClassroomRepository(XEduDbContext context) : base(context)
    {
    }

    public async Task<List<Classroom>> GetByTeacherIdAsync(long teacherId)
    {
        return await _context.Classrooms
            .Where(c => c.TeacherId == teacherId)
            .ToListAsync();
    }
    
    public async Task<int> CountStudentsAsync(long? teacherId, long? classroomId)
    {
        var query = _context.ClassroomStudents.Where(cs => cs.Active);

        if (teacherId.HasValue)
        {
            query = query.Where(cs => cs.Classroom.TeacherId == teacherId.Value);
        }

        if (classroomId.HasValue)
        {
            query = query.Where(cs => cs.ClassroomId == classroomId.Value);
        }

        return await query.CountAsync();
    }
}