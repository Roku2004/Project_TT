using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class TopicRepository : Repository<Topic>
{
    public TopicRepository(XEduDbContext context) : base(context)
    {
    }
}