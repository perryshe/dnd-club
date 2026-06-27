using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace tic_tac.datasource.model;

/// <summary>
/// Модель игры для слоя datasource.
/// Связывает идентификатор с игровым полем для хранения.
/// </summary>
[Table("games")] // имя таблицы, дублирует entity.ToTable("games")
public class GameModel
{
    /// <summary>
    /// Уникальный идентификатор игры (UUID).
    /// </summary>
    [Key] // — первичный ключ, дублирует entity.HasKey(e => e.Id)
    public Guid Id { get; set; }

    /// <summary>
    /// Модель игрового поля.
    /// </summary>
    public BoardModel Board { get; set; }

    /// <summary>
    /// Конструктор по умолчанию — создаёт пустую игру.
    /// </summary>
    public GameModel()
    {
        Board = new BoardModel();
    }

    /// <summary>
    /// Конструктор с указанием Id и доски.
    /// </summary>
    /// <param name="id">Уникальный идентификатор игры</param>
    /// <param name="board">Модель игрового поля</param>
    public GameModel(Guid id, BoardModel board)
    {
        Id = id;
        Board = board;
    }

    [Required]
    public string State { get; set; } = "WaitingForPlayers";

    [Required]
    public string GameType { get; set; } = "VsPlayer";

    public Guid? PlayerXId { get; set; }
    public Guid? PlayerOId { get; set; }
}
