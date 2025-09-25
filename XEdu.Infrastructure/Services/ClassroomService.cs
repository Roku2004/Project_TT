using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using XEdu.Core.DTOs.request.Classroom;
using XEdu.Core.DTOs.response.Classroom;
using XEdu.Core.Entities;
using XEdu.Core.IService;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;
namespace XEdu.Infrastructure.Services;

public class ClassroomService : IClassroomService
{
    private readonly ClassroomRepository _classroomRepository;
    private readonly UserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly XEduDbContext _dbContext;

    public ClassroomService(ClassroomRepository classroomRepository, IMapper mapper, UserRepository userRepository,
        XEduDbContext dbContext)
    {
        _classroomRepository = classroomRepository;
        _mapper = mapper;
        _userRepository = userRepository;
        _dbContext = dbContext;
    }

    public string GenerateClassCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        var code = new char[6];

        for (int i = 0; i < code.Length; i++)
        {
            code[i] = chars[random.Next(chars.Length)];
        }

        return new string(code);
    }
    
    public async Task<PagedResult<ClassroomByIdResponse>> GetClassroomsByTeacherAsync(long teacherId, int page, int size)
    {
        var teacher = await _dbContext.Users.FindAsync(teacherId);
        if (teacher == null)
            return null;
    
        var query = _dbContext.Classrooms
            .Where(c => c.TeacherId == teacherId)
            .OrderByDescending(c => c.CreatedAt);
    
        var totalElements = await query.CountAsync();
    
        var classrooms = await query
            .Skip(page * size)
            .Take(size)
            .ProjectTo<ClassroomByIdResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();
    
        // Cập nhật student count cho mỗi classroom
        foreach (var classroom in classrooms)
        {
            classroom.currentStudentCount = await _dbContext.ClassroomStudents
                .CountAsync(cs => cs.ClassroomId == classroom.id);
        }
    
        return new PagedResult<ClassroomByIdResponse>
        {
            Content = classrooms,
            TotalElements = totalElements,
            Page = page,
            Size = size
        };
    }

    public async Task<string> CreateClassroomAsync(long teacherId, CreateClass request)
    {
        var teacher = await _userRepository.GetByIdAsync(teacherId);
        if (teacher == null) return "Teacher not found";

        var subject = await _dbContext.Subjects.FindAsync(request.subjectId);
        if (subject == null) return "Subject not found";

        var grade = await _dbContext.Grades.FindAsync(request.gradeId);
        if (grade == null) return "Grade not found";

        var existingClassroom = await _dbContext.Classrooms
            .FirstOrDefaultAsync(c => c.Name == request.name);
        if (existingClassroom != null) return "Classroom with this name already exists";
        
        var classroom = _mapper.Map<Classroom>(request);
        classroom.TeacherId = teacherId;
        classroom.ClassCode = GenerateClassCode();
        await _dbContext.Classrooms.AddAsync(classroom);
        await _dbContext.SaveChangesAsync();
        return "Classroom created successfully";
    }

    public async Task<ClassroomByIdResponse> GetClassroomByIdAsync(long classId)
    {
        var classroom = await _dbContext.Classrooms
            .FirstOrDefaultAsync(c => c.Id == classId);

        if (classroom == null) return null;

        var response = _mapper.Map<ClassroomByIdResponse>(classroom);
        response.currentStudentCount = await _dbContext.ClassroomStudents
            .CountAsync(cs => cs.ClassroomId == classId);

        return response;
    }
}