namespace tic_tac.domain.model;

public class User
{
    public Guid Id { get; }
    public string Login { get; }
    public string? Email { get; }

    public User(Guid id, string login, string? email = null)
    {
        Id = id;
        Login = login;
        Email = email;
    }
}
