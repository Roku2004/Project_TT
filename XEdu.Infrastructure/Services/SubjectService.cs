using AutoMapper;
using XEdu.Core.DTOs.response.Subject;
using XEdu.Core.IService;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class SubjectService : ISubjectService
{
    private readonly SubjectRepository _subjectRepository;
    private readonly IMapper _mapper;

    public SubjectService(SubjectRepository subjectRepository, IMapper mapper)
    {
        _subjectRepository = subjectRepository;
        _mapper = mapper;
    }

    public async Task<List<SubjectResponse>> GetAllSubjectsAsync()
    {
        var subjects = await _subjectRepository.GetAllAsync();
        if (subjects == null)
        {
            return null;
        }
        return _mapper.Map<List<SubjectResponse>>(subjects);
    }
}