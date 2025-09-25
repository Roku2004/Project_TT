using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class CourseEnrollmentRepository : Repository<CourseEnrollment>
{
    public CourseEnrollmentRepository(XEduDbContext context) : base(context)
    {
    }

    public object GetCoursesByStudentId(long studentId)
    {
        throw new NotImplementedException();
    }

    public async Task<CourseEnrollment?> GetByStudentIdAndCourseIdAsync(long studentId, long courseId)
    {
        return await _context.CourseEnrollments.FirstOrDefaultAsync(c => c.StudentId == studentId && c.CourseId == courseId);
    }
}