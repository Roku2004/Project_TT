using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class GradeRepository : Repository<Grade>
{
    public GradeRepository(XEduDbContext context) : base(context)
    {
        
    }
}