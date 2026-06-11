using tic_tac.domain.model;

namespace tic_tac.web.mapper;

public class GameWebMapper : IGameWebMapper
{
    public web.model.GameDto ToDto(Game game, Guid? currentUserId = null)
    {
        var boardDto = new web.model.BoardDto(game.Board.Size);
        for (int i = 0; i < game.Board.Size; i++)
            for (int j = 0; j < game.Board.Size; j++)
                boardDto.Board[i][j] = game.Board.GetCell(i, j);

        return new web.model.GameDto
        {
            Id = game.Id,
            Board = boardDto,
            State = game.State.ToString(),
            GameType = game.GameType.ToString(),
            PlayerXId = game.PlayerXId,
            PlayerOId = game.PlayerOId,
        };
    }
}