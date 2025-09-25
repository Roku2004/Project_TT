using XEdu.Core.DTOs.request.Classroom;
using XEdu.Core.DTOs.response.ClassStudent;

namespace XEdu.Core.IService;

public interface IClassStudentService
{
    Task<string> AddStudentToClassroomAsync(long teacherId, AddStudent addStudent);
    Task<List<ClassStudent>> GetStudentsByClassroomIdAsync(long classid);
    Task<string> RemoveStudentFromClassroomAsync(long teacherId, long classid, long studentId);
}