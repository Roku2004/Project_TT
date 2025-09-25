using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class ClassStudentRepository : Repository<ClassroomStudent>
{
    public ClassStudentRepository(XEduDbContext context) : base(context)
    {
    }
}