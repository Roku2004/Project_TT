using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Core.Enums;
using XEdu.Core.Interfaces;
using XEdu.Infrastructure.Data;

namespace XEdu.Infrastructure.Repositories;

public class UserRepository : Repository<User>
{
    public UserRepository(XEduDbContext context) : base(context)
    {
    }

    public async Task<User?> FindByEmailAsync(string email)
    {
        try
        {
            return await _context.Users
                .AsNoTracking()
                .Where(u => u.Email == email)
                .Select(u => new User
                {
                    Id = u.Id,
                    Email = u.Email ?? string.Empty,
                    Password = u.Password ?? string.Empty,
                    FullName = u.FullName ?? string.Empty,
                    Role = u.Role,
                    Provider = u.Provider,
                    ProviderId = u.ProviderId,
                    Avatar = u.Avatar,
                    Phone = u.Phone,
                    EmailVerified = u.EmailVerified,
                    Active = u.Active,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt,
                    LastLogin = u.LastLogin
                })
                .FirstOrDefaultAsync();
        }
        catch (InvalidCastException)
        {
            return null;
        }
    }
   
    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> FindByRoleAndActiveAsync(Role role, bool active = true)
    {
        return await _dbSet
            .Where(u => u.Role == role && u.Active == active)
            .ToListAsync();
    }

    public async Task<int> CountByRoleAndActiveAsync(Role role, bool active = true)
    {
        return await _dbSet
            .CountAsync(u => u.Role == role && u.Active == active);
    }

    public async Task<IEnumerable<User>> SearchUsersAsync(string searchTerm, int page = 1, int pageSize = 10)
    {
        var query = _dbSet.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(u => 
                u.FullName.ToLower().Contains(term) || 
                u.Email!.ToLower().Contains(term));
        }

        return await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountByCreatedAfterAsync(DateTime date)
    {
        return await _dbSet.CountAsync(u => u.CreatedAt >= date);
    }

    public async Task<int> CountByLastLoginAfterAsync(DateTime date)
    {
        return await _dbSet.CountAsync(u => u.LastLogin >= date);
    }

    public async Task<IEnumerable<User>> FindByRoleAsync(Role role)
    {
        return await _dbSet
            .Where(u => u.Role == role)
            .ToListAsync();
    }
}