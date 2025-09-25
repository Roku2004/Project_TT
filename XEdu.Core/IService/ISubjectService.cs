using XEdu.Core.DTOs.response.Subject;

namespace XEdu.Core.IService;

public interface ISubjectService
{
    Task<List<SubjectResponse>> GetAllSubjectsAsync();
}