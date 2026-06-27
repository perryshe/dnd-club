using Microsoft.EntityFrameworkCore;
using tic_tac.datasource;
using tic_tac.datasource.model;
using tic_tac.web.model;

namespace tic_tac.domain.service;

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> RegisterAsync(SignUpRequest request)
    {
        if (await _dbContext.Users.AnyAsync(u => u.Login == request.Login))
            return false;

        _dbContext.Users.Add(new UserModel
        {
            Id = Guid.NewGuid(),
            Login = request.Login,
            Password = request.Password
        });
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<Guid?> ValidateCredentialsAsync(string login, string password)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Login == login && u.Password == password);
        return user?.Id;
    }
}