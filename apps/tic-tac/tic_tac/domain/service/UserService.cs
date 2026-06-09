using tic_tac.datasource;
using tic_tac.datasource.model;
using tic_tac.domain.model;

namespace tic_tac.domain.service;

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public bool Register(string login, string password)
    {
        if (string.IsNullOrWhiteSpace(login) || string.IsNullOrWhiteSpace(password))
            return false;

        if (_dbContext.Users.Any(u => u.Login == login))
            return false;

        var user = new UserModel
        {
            Id = Guid.NewGuid(),
            Login = login,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        return true;
    }

    public Guid? Authorize(string login, string password)
    {
        var userModel = _dbContext.Users.FirstOrDefault(u => u.Login == login);
        if (userModel == null)
            return null;

        if (!BCrypt.Net.BCrypt.Verify(password, userModel.PasswordHash))
            return null;

        return userModel.Id;
    }

    public User? GetById(Guid id)
    {
        var userModel = _dbContext.Users.Find(id);
        if (userModel == null)
            return null;

        return new User(userModel.Id, userModel.Login);
    }
}
