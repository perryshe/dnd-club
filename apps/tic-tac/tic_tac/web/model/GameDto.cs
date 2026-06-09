namespace tic_tac.web.model;

/// <summary>
/// DTO (Data Transfer Object) для игры.
/// Используется для передачи данных между клиентом и сервером через JSON.
/// </summary>
public class GameDto
{
    /// <summary>
    /// Уникальный идентификатор игры (UUID).
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// DTO игрового поля.
    /// </summary>
    public BoardDto? Board { get; set; }

    /// <summary>
    /// Флаг: игра окончена или нет.
    /// </summary>
    public bool IsOver { get; set; }

    /// <summary>
    /// Победитель:
    /// - 0 = игра идёт или ничья
    /// - 1 = победил игрок (X)
    /// - 2 = победил компьютер (O)
    /// </summary>
    public int Winner { get; set; }

    /// <summary>
    /// Сообщение о результате игры (например, "You win!" или "Draw!").
    /// </summary>
    public string? Message { get; set; }

    /// <summary>
    /// Конструктор по умолчанию.
    /// </summary>
    public GameDto()
    {
        Board = new BoardDto();
    }
}
