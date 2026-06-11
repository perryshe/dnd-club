namespace tic_tac.web.model;

public class GameDto
{
    public Guid Id { get; set; }
    public BoardDto? Board { get; set; }
    public string State { get; set; } = string.Empty;
    public string GameType { get; set; } = string.Empty;
    public Guid? PlayerXId { get; set; }
    public Guid? PlayerOId { get; set; }

    public GameDto()
    {
        Board = new BoardDto();
    }
}
