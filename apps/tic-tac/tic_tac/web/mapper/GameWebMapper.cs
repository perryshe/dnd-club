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

    public Game ToDomain(web.model.GameDto dto)
    {
        var board = new int[dto.Board.Size, dto.Board.Size];
        for (int i = 0; i < dto.Board.Size; i++)
            for (int j = 0; j < dto.Board.Size; j++)
                board[i, j] = dto.Board.Board[i][j];
        var domainBoard = new GameBoard(board);
        return new Game(dto.Id, domainBoard);
    }

    public void UpdateGameFromDto(Game game, web.model.GameDto dto)
    {
        if (dto.Board == null) return;
        for (int i = 0; i < dto.Board.Size; i++)
            for (int j = 0; j < dto.Board.Size; j++)
                game.Board.SetCell(i, j, dto.Board.Board[i][j]);
    }
}
