using Npgsql;
using tic_tac.datasource;
using tic_tac.datasource.model;
using tic_tac.domain.model;

namespace tic_tac.domain.service;

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;
    private readonly string _clubConnectionString;

    public UserService(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _clubConnectionString = configuration.GetConnectionString("ClubConnection") ?? "";
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

        if (string.IsNullOrEmpty(userModel.PasswordHash))
            return userModel.Id;

        if (!BCrypt.Net.BCrypt.Verify(password, userModel.PasswordHash))
            return null;

        return userModel.Id;
    }

    public User? GetById(Guid id)
    {
        var userModel = _dbContext.Users.Find(id);
        if (userModel == null)
            return null;

        return new User(userModel.Id, userModel.Login, userModel.Email);
    }

    public ClubUser? FindClubUser(string login)
    {
        using var conn = new NpgsqlConnection(_clubConnectionString);
        conn.Open();
        using var cmd = new NpgsqlCommand(
            "SELECT school_nick, email, password, role FROM users WHERE school_nick = @login OR email = @login LIMIT 1",
            conn
        );
        cmd.Parameters.AddWithValue("@login", NpgsqlTypes.NpgsqlDbType.Text, login);
        using var reader = cmd.ExecuteReader();
        if (!reader.Read()) return null;
        return new ClubUser
        {
            Login = reader.GetString(0),
            Email = reader.IsDBNull(1) ? null : reader.GetString(1),
            Password = reader.GetString(2),
            Role = reader.GetString(3)
        };
    }

    public User? AutoLink(string login, string? email)
    {
        if (string.IsNullOrWhiteSpace(login))
            return null;

        var emailConflict = _dbContext.Users.Where(u => u.Email == email && u.Login != login).ToList();
        foreach (var u in emailConflict)
        {
            _dbContext.GameResults.RemoveRange(_dbContext.GameResults.Where(r => r.UserId == u.Id));
            _dbContext.Users.Remove(u);
        }

        var existing = _dbContext.Users.FirstOrDefault(u => u.Login == login);
        if (existing != null)
        {
            if (email != null) existing.Email = email;
            _dbContext.SaveChanges();
            return new User(existing.Id, existing.Login, existing.Email);
        }

        var user = new UserModel
        {
            Id = Guid.NewGuid(),
            Login = login,
            Email = email,
            PasswordHash = "",
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        return new User(user.Id, user.Login, user.Email);
    }
}
