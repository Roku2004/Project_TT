using XEdu.Core.Entities;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class QuestionRepository : Repository<Question>
{
    public QuestionRepository(XEduDbContext context) : base(context)
    {
    }
}