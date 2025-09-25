using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class SubjectRepository : Repository<Subject>
{
    public SubjectRepository(XEduDbContext context) : base(context)
    {
    }
}