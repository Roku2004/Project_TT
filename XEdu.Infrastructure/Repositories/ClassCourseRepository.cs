using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class ClassCourseRepository : Repository<ClassroomCourse>
{
    public ClassCourseRepository(XEduDbContext context) : base(context)
    {
    }
}