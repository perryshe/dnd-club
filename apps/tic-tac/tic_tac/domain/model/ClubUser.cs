namespace tic_tac.domain.model;

public class ClubUser
{
    public string Login { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
