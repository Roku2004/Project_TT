using XEdu.Core.Entities;

namespace XEdu.Core.Interfaces;

public interface IClassroomRepository : IRepository<Classroom>
{
    // Task<List<Classroom>> GetByTeacherIdAsync(long teacherId);
    // Task<int> CountStudentsAsync(long? teacherId, long? classroomId);
}