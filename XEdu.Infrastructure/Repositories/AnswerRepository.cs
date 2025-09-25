using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class AnswerRepository : Repository<Answer>
{
    public AnswerRepository(XEduDbContext context) : base(context)
    {
    }
}