namespace tic_tac.domain.model;

public class Game
{
    public Guid Id { get; }
    public GameBoard Board { get; }

    public Game(Guid id, GameBoard board, GameState state = GameState.WaitingForPlayers,
        GameType gameType = GameType.VsPlayer, Guid? playerXId = null, Guid? playerOId = null)
    {
        Id = id;
        Board = board;
        State = state;
        GameType = gameType;
        PlayerXId = playerXId;
        PlayerOId = playerOId;
    }

    public Game(Guid id, GameType gameType, Guid? playerXId = null)
        : this(id, new GameBoard(3),
            gameType == GameType.VsPlayer ? GameState.WaitingForPlayers : GameState.PlayerXTurn,
            gameType, playerXId, null)
    {
    }

    public GameState State { get; set; } = GameState.WaitingForPlayers;
    public GameType GameType { get; set; }
    public Guid? PlayerXId { get; set; }
    public Guid? PlayerOId { get; set; }
}
