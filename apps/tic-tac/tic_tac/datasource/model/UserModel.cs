using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tic_tac.datasource.model;

[Table("users")]
public class UserModel
{
    [Key]
    public Guid Id { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; }

    public UserModel()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        Login = string.Empty;
        PasswordHash = string.Empty;
    }

    public UserModel(Guid id, string login, string passwordHash, DateTime createdAt)
    {
        Id = id;
        Login = login;
        PasswordHash = passwordHash;
        CreatedAt = createdAt;
    }
}
