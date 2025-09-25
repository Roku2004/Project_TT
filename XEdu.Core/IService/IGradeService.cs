using XEdu.Core.DTOs.response.Grade;

namespace XEdu.Core.IService;

public interface IGradeService
{
    Task<List<GradeResponse>> GetGradesAsync();
}