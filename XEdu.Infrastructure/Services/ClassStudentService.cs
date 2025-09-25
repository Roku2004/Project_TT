using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using XEdu.Core.DTOs.request.Classroom;
using XEdu.Core.DTOs.response.ClassStudent;
using XEdu.Core.Entities;
using XEdu.Core.Enums;
using XEdu.Core.IService;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;

namespace XEdu.Infrastructure.Services;

public class ClassStudentService : IClassStudentService
{
    private readonly ClassroomRepository _classroomRepository;
    private readonly UserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly XEduDbContext _dbContext;
    private readonly ClassStudentRepository _classStudentRepository;

    public ClassStudentService(ClassroomRepository classroomRepository, IMapper mapper, UserRepository userRepository,
        XEduDbContext dbContext, ClassStudentRepository classStudentRepository)
    {
        _classroomRepository = classroomRepository;
        _mapper = mapper;
        _userRepository = userRepository;
        _dbContext = dbContext;
        _classStudentRepository = classStudentRepository;
    }
    
    public async Task<string> AddStudentToClassroomAsync(long teacherId, AddStudent addStudent)
    {
        var teacher = await _dbContext.Users.FindAsync(teacherId);
        if (teacher == null)
            return "Teacher not found";
    
        var classroom = await _dbContext.Classrooms.FindAsync(addStudent.classid);
        if (classroom == null)
            return "Classroom not found";
    
        // Chỉ select Id để tránh load các cột có thể NULL
        var student = await _dbContext.Users
            .Where(u => u.Email == addStudent.studentEmail)
            .Select(u => new { u.Id, u.Email })
            .FirstOrDefaultAsync();
        if (student == null)
            return "Student not found";
    
        var existingStudent = await _dbContext.ClassroomStudents
            .Where(cs => cs.ClassroomId == addStudent.classid && cs.StudentId == student.Id)
            .FirstOrDefaultAsync();
        if (existingStudent != null)
            return "Student already in classroom";
    
        long currentStudentCount = await _dbContext.ClassroomStudents
            .CountAsync(cs => cs.ClassroomId == classroom.Id);
    
        if (currentStudentCount >= classroom.MaxStudents)
            return "Classroom is full";
    
        var mapStudent = _mapper.Map<ClassroomStudent>(addStudent);
        mapStudent.ClassroomId = addStudent.classid;
        mapStudent.StudentId = student.Id;
        _dbContext.ClassroomStudents.Add(mapStudent);
        await _dbContext.SaveChangesAsync();
    
        return "Student added successfully";
    }

    public async Task<List<ClassStudent>> GetStudentsByClassroomIdAsync(long classid)
    {
        var students = await _dbContext.ClassroomStudents
            .Where(cs => cs.ClassroomId == classid)
            .Include(cs => cs.Student)
            .ProjectTo<ClassStudent>(_mapper.ConfigurationProvider)
            .ToListAsync();
        if (students == null)
        {
            return null;
        }
        return students;
    }

    public async Task<string> RemoveStudentFromClassroomAsync(long teacherId, long classid, long studentId)
    {
        var teacher = await _dbContext.Users.FindAsync(teacherId);
        if (teacher == null)
            return "Teacher not found";

        var classroom = await _dbContext.Classrooms.FindAsync(classid);
        if (classroom == null)
            return "Classroom not found";
        
        if(classroom.TeacherId != teacherId)
            return "You are not authorized to remove students from this classroom";

        var student = await _dbContext.Users
            .Where(u => u.Id == studentId)
            .Select(u => new { u.Id, u.Email })
            .FirstOrDefaultAsync();
        if (student == null)
            return "Student not found";

        var classStudent = await _dbContext.ClassroomStudents
            .FirstOrDefaultAsync(cs => cs.ClassroomId == classid && cs.StudentId == student.Id);
        if (classStudent == null)
            return "Student not in classroom";

        _dbContext.ClassroomStudents.Remove(classStudent);
        await _dbContext.SaveChangesAsync();

        return "Student removed successfully";
    }
}