using XEdu.Core.DTOs.request.Classroom;
using XEdu.Core.DTOs.response.Classroom;
using XEdu.Core.Entities;

namespace XEdu.Core.IService;

public interface IClassroomService
{
    Task<PagedResult<ClassroomByIdResponse>> GetClassroomsByTeacherAsync(long teacherId, int page, int size);
    Task<String> CreateClassroomAsync(long teacherId, CreateClass missing_name);
    Task<ClassroomByIdResponse> GetClassroomByIdAsync(long classId);
}