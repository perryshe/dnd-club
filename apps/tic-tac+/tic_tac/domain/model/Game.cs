namespace tic_tac.domain.model;

/// <summary>
/// Модель текущей игры.
/// Связывает уникальный идентификатор с игровым полем.
/// </summary>
public class Game
{
    /// <summary>
    /// Уникальный идентификатор игры (UUID/GUID).
    /// Guid — глобально уникальный 128-битный идентификатор.
    /// Пример: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    /// </summary>
    public Guid Id { get; }

    /// <summary>
    /// Игровое поле этой игры.
    /// </summary>
    public GameBoard Board { get; }

    /// <summary>
    /// Конструктор для создания игры с заданным Id и полем.
    /// </summary>
    /// <param name="id">Уникальный идентификатор игры</param>
    /// <param name="board">Игровое поле</param>
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
