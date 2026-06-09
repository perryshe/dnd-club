using tic_tac.domain.model;

namespace tic_tac.datasource.mapper;

/// <summary>
/// Интерфейс маппера для конвертации между domain и datasource моделями.
/// </summary>
public interface IGameMapper
{
    /// <summary>
    /// Конвертирует domain модель в datasource модель.
    /// </summary>
    datasource.model.GameModel ToDataModel(Game game);

    /// <summary>
    /// Конвертирует datasource модель в domain модель.
    /// </summary>
    Game ToDomain(datasource.model.GameModel gameModel);
}
