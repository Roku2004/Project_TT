using XEdu.Core.Entities;
using XEdu.Core.Enums;

namespace XEdu.Core.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> FindByEmailAsync(string email);
    Task<bool> ExistsByEmailAsync(string email);
    Task<IEnumerable<User>> FindByRoleAndActiveAsync(Role role, bool active = true);
    Task<int> CountByRoleAndActiveAsync(Role role, bool active = true);
    Task<IEnumerable<User>> SearchUsersAsync(string searchTerm, int page = 1, int pageSize = 10);
    Task<int> CountByCreatedAfterAsync(DateTime date);
    Task<int> CountByLastLoginAfterAsync(DateTime date);
    Task<IEnumerable<User>> FindByRoleAsync(Role role);
}