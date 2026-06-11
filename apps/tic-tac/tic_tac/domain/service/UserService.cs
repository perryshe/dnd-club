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

        return new User(userModel.Id, userModel.Login);
    }

    public User? FindOrCreate(string login)
    {
        // If login looks like an email, try to resolve to school nickname
        var resolvedLogin = login;
        if (login.Contains('@') && !string.IsNullOrEmpty(_clubConnectionString))
        {
            var schoolNick = GetSchoolNick(login);
            if (!string.IsNullOrEmpty(schoolNick))
                resolvedLogin = schoolNick;
        }

        var existing = _dbContext.Users.FirstOrDefault(u => u.Login == resolvedLogin);
        if (existing != null)
            return new User(existing.Id, existing.Login);

        var user = new UserModel
        {
            Id = Guid.NewGuid(),
            Login = resolvedLogin,
            PasswordHash = "",
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        return new User(user.Id, user.Login);
    }

    private string? GetSchoolNick(string email)
    {
        try
        {
            using var conn = new NpgsqlConnection(_clubConnectionString);
            conn.Open();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT school_nick FROM users WHERE email = @email";
            cmd.Parameters.AddWithValue("@email", NpgsqlTypes.NpgsqlDbType.Text, email);
            return cmd.ExecuteScalar() as string;
        }
        catch
        {
            return null;
        }
    }
}
