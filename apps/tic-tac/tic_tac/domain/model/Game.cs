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
    public Game(Guid id, GameBoard board)
    {
        Id = id;
        Board = board;
    }

    /// <summary>
    /// Конструктор по умолчанию — создаёт новую игру с новым Id и пустым полем.
    /// Вызывает основной конструктор через this(...).
    /// Использование: var game = new Game();
    /// </summary>
    public Game() : this(Guid.NewGuid(), new GameBoard(3))
    {
    }
}
