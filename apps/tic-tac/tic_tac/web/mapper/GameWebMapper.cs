using tic_tac.domain.model;

namespace tic_tac.web.mapper;

/// <summary>
/// Реализация маппера для конвертации между domain и web моделями.
/// </summary>
public class GameWebMapper : IGameWebMapper
{
    /// <summary>
    /// Конвертирует domain Game в web GameDto.
    /// </summary>
    /// <param name="game">Domain объект игры</param>
    /// <param name="winner">Победитель (0, 1, 2)</param>
    /// <param name="isOver">Игра окончена?</param>
    /// <param name="message">Сообщение о результате</param>
    /// <returns>DTO объект для отправки клиенту</returns>
    public web.model.GameDto ToDto(Game game, int winner = 0, bool isOver = false, string? message = null)
    {
        var boardDto = new web.model.BoardDto(game.Board.Size);
        for (int i = 0; i < game.Board.Size; i++)
            for (int j = 0; j < game.Board.Size; j++)
                boardDto.Board[i][j] = game.Board.GetCell(i, j);

        return new web.model.GameDto
        {
            Id = game.Id,
            Board = boardDto,
            IsOver = isOver,
            Winner = winner,
            Message = message
        };
    }

    /// <summary>
    /// Конвертирует web GameDto в domain Game.
    /// </summary>
    /// <param name="dto">DTO объект от клиента</param>
    /// <returns>Domain объект игры</returns>
    public Game ToDomain(web.model.GameDto dto)
    {
        var board = new int[dto.Board.Size, dto.Board.Size];
        for (int i = 0; i < dto.Board.Size; i++)
            for (int j = 0; j < dto.Board.Size; j++)
                board[i, j] = dto.Board.Board[i][j];
        var domainBoard = new GameBoard(board);
        return new Game(dto.Id, domainBoard);
    }

    /// <summary>
    /// Обновляет domain Game данными из DTO.
    /// Копирует значения поля из DTO в существующий domain объект.
    /// </summary>
    /// <param name="game">Существующий domain объект</param>
    /// <param name="dto">DTO с новыми данными</param>
    public void UpdateGameFromDto(Game game, web.model.GameDto dto)
    {
        if (dto.Board == null) return;
        for (int i = 0; i < dto.Board.Size; i++)
            for (int j = 0; j < dto.Board.Size; j++)
                game.Board.SetCell(i, j, dto.Board.Board[i][j]);
    }
}
