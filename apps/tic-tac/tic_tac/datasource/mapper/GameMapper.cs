using System.Text.Json;
using tic_tac.domain.model;
using DataBoardModel = tic_tac.datasource.model.BoardModel;
using DataGameModel = tic_tac.datasource.model.GameModel;

namespace tic_tac.datasource.mapper;

public class GameMapper : IGameMapper
{
    public DataGameModel ToDataModel(Game game)
    {
        var boardModel = new DataBoardModel(game.Board.Board);
        var json = JsonSerializer.Serialize(boardModel);
        return new DataGameModel(game.Id, json);
    }

    public Game ToDomain(DataGameModel gameModel)
    {
        var boardModel = JsonSerializer.Deserialize<DataBoardModel>(gameModel.BoardJson) ?? new DataBoardModel();
        var BoardData = boardModel.Board;
        var size = BoardData.Count;
        var array = new int[size, size];
        for (var i = 0; i < size; i++)
            for (int j = 0; j < size; j++)
                array[i, j] = BoardData[i][j];
        var domainBoard = new GameBoard(array);
        return new Game(gameModel.Id, domainBoard);
    }
}
