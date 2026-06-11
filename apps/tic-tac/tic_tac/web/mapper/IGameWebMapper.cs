using tic_tac.domain.model;

namespace tic_tac.web.mapper;

/// <summary>
/// Интерфейс маппера для конвертации между domain и web моделями.
/// </summary>
public interface IGameWebMapper
{
    /// <summary>
    /// Конвертирует domain Game в web DTO.
    /// </summary>
    web.model.GameDto ToDto(Game game, int winner = 0, bool isOver = false, string? message = null);

    /// <summary>
    /// Конвертирует web DTO в domain модель Game.
    /// </summary>
    Game ToDomain(web.model.GameDto dto);

    /// <summary>
    /// Обновляет domain Game данными из DTO.
    /// </summary>
    void UpdateGameFromDto(Game game, web.model.GameDto dto);
}
