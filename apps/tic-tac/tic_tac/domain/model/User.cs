namespace tic_tac.domain.model;

public class User
{
    public Guid Id { get; }
    public string Login { get; }

    public User(Guid id, string login)
    {
        Id = id;
        Login = login;
    }
}
