using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class ClassExamRepository : Repository<ClassroomExam>
{
    public ClassExamRepository(XEduDbContext context) : base(context)
    {
    }
}