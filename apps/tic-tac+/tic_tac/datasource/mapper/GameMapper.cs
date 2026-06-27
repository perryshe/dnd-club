using tic_tac.domain.model;
using DataBoardModel = tic_tac.datasource.model.BoardModel;
using DataGameModel = tic_tac.datasource.model.GameModel;

namespace tic_tac.datasource.mapper;

/// <summary>
/// Реализация маппера для конвертации между domain и datasource моделями.
/// </summary>
public class GameMapper : IGameMapper
{
    /// <summary>
    /// Конвертирует domain Game в datasource GameModel.
    /// </summary>
    public DataGameModel ToDataModel(Game game)
    {
        var boardModel = new DataBoardModel(game.Board.Board);
        return new DataGameModel(game.Id, boardModel)
        {
            State = game.State.ToString(),
            GameType = game.GameType.ToString(),
            PlayerXId = game.PlayerXId,
            PlayerOId = game.PlayerOId
        };
    }

    /// <summary>
    /// Конвертирует datasource GameModel в domain Game.
    /// </summary>
    public Game ToDomain(DataGameModel gameModel)
    {
        var BoardData = gameModel.Board.Board;
        var size = BoardData.Count;
        var array = new int[size, size];
        for (var i = 0; i < size; i++)
            for (int j = 0; j < size; j++)
                array[i, j] = BoardData[i][j];
        var domainBoard = new GameBoard(array);
        return new Game(gameModel.Id, domainBoard,
            Enum.Parse<GameState>(gameModel.State),
            Enum.Parse<GameType>(gameModel.GameType),
            gameModel.PlayerXId, gameModel.PlayerOId);
    }
}
