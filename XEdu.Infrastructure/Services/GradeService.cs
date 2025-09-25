using AutoMapper;
using XEdu.Core.DTOs.response.Grade;
using XEdu.Core.IService;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class GradeService : IGradeService
{
    private readonly GradeRepository _gradeRepository;
    private readonly IMapper _mapper;

    public GradeService(GradeRepository gradeRepository, IMapper mapper)
    {
        _gradeRepository = gradeRepository;
        _mapper = mapper;
    }

    public async Task<List<GradeResponse>> GetGradesAsync()
    {
        var grades = await _gradeRepository.GetAllAsync();
        if (grades == null )
        {
            return null;
        }
        return _mapper.Map<List<GradeResponse>>(grades);
    }
}