using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;
using tic_tac.datasource;
using tic_tac.datasource.mapper;
using tic_tac.datasource.model;
using tic_tac.domain.model;
using tic_tac.domain.service;
using tic_tac.web.auth;
using tic_tac.web.mapper;
using tic_tac.web.model;

namespace tic_tac.web.controller;

/// <summary>
/// REST контроллер для управления играми крестики-нолики.
/// Обрабатывает HTTP запросы от клиента.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[UserAuthenticator]
public class GameController : ControllerBase
{
    private readonly IGameService _gameService;
    // private readonly IGameRepository _gameRepository;
    private readonly AppDbContext _dbContext;
    private readonly IGameMapper _gameMapper;
    private readonly IGameWebMapper _mapper;

    /// <summary>
    /// Конструктор с внедрением зависимостей.
    /// </summary>
    public GameController(IGameService gameService, AppDbContext dbContext, IGameWebMapper mapper, IGameMapper gameMapper)
    {
        _gameService = gameService;
        _dbContext = dbContext;
        _mapper = mapper;
        _gameMapper = gameMapper;
    }

    /// <summary>
    /// Создаёт новую игру.
    /// </summary>
    /// <returns>Новая игра с уникальным ID</returns>
    /// <remarks>GET /api/game</remarks>
    [HttpGet]
    public ActionResult<GameDto> CreateGame()
    {
        var game = new Game();
        var gameModel = _gameMapper.ToDataModel(game);
        _dbContext.Games.Add(gameModel);
        _dbContext.SaveChanges();
        //_gameRepository.Save(game);
        return Ok(_mapper.ToDto(game));
    }

    /// <summary>
    /// Получает игру по ID.
    /// </summary>
    /// <param name="id">UUID игры</param>
    /// <returns>Игра или 404 если не найдена</returns>
    /// <remarks>GET /api/game/{id}</remarks>
    [HttpGet("{id:guid}")]
    public ActionResult<GameDto> GetGame(Guid id)
    {
        // var game = _gameRepository.Get(id);
        // if (game == null)
        //    return NotFound(new { error = "Game not found" });

        var gameModel = _dbContext.Games.Find(id);
        if (gameModel == null)
            return NotFound(new {error = "Game not found"});
        var game = _gameMapper.ToDomain(gameModel);
        var (winner, isOver) = _gameService.CheckGameOver(game);
        var message = GetResultMessage(winner, isOver);
        return Ok(_mapper.ToDto(game, winner, isOver, message));
    }

    /// <summary>
    /// Обрабатывает ход игрока и возвращает обновлённую игру с ходом компьютера.
    /// </summary>
    /// <param name="id">UUID игры</param>
    /// <param name="moveDto">Доска с ходом игрока</param>
    /// <returns>Обновлённая игра или ошибка</returns>
    /// <remarks>POST /api/game/{id}</remarks>
    [HttpPost("{id:guid}")]
    public ActionResult<GameDto> MakeMove(Guid id, [FromBody] GameDto moveDto)
    {
        // var game = _gameRepository.Get(id);
        var gameModel = _dbContext.Games.Find(id);
        if (gameModel == null) 
            return NotFound(new { error = "Game not found" });
        var game = _gameMapper.ToDomain(gameModel);

        if (game == null)
            return NotFound(new { error = "Game not found" });

        var (winnerCheck, isOverCheck) = _gameService.CheckGameOver(game);
        if (isOverCheck)
            return BadRequest(new { error = "Game is already over" });

        int playerRow = -1, playerCol = -1;
        for (int i = 0; i < 3; i++)
        {
            for (int j = 0; j < 3; j++)
            {
                int dtoValue = moveDto.Board?.Board[i]?[j] ?? 0;
                int currentValue = game.Board.GetCell(i, j);

                if (dtoValue != currentValue)
                {
                    if (currentValue != 0)
                        return BadRequest(new { error = "Cell already occupied" });
                    if (dtoValue != 1)
                        return BadRequest(new { error = "Invalid move value" });

                    playerRow = i;
                    playerCol = j;
                }
            }
        }

        if (playerRow < 0)
            return BadRequest(new { error = "No move detected" });

        game.Board.SetCell(playerRow, playerCol, 1);

        var (playerWin, playerOver) = _gameService.CheckGameOver(game);
        if (playerOver)
        {
            // Save(game);
            gameModel.BoardJson = _gameMapper.ToDataModel(game).BoardJson;
            _dbContext.SaveChanges();
            var message = GetResultMessage(playerWin, playerOver);
            return Ok(_mapper.ToDto(game, playerWin, playerOver, message));
        }

        var (compRow, compCol) = _gameService.GetNextMove(game);
        if (compRow >= 0 && compCol >= 0)
            game.Board.SetCell(compRow, compCol, 2);

        // Save(game);
        gameModel.BoardJson = _gameMapper.ToDataModel(game).BoardJson;
        _dbContext.SaveChanges();

        var (finalWinner, finalIsOver) = _gameService.CheckGameOver(game);
        var finalMessage = GetResultMessage(finalWinner, finalIsOver);
        return Ok(_mapper.ToDto(game, finalWinner, finalIsOver, finalMessage));
    }

    /// <summary>
    /// Формирует сообщение о результате игры.
    /// </summary>
    /// <param name="winner">Победитель (0, 1, 2)</param>
    /// <param name="isOver">Игра окончена?</param>
    /// <returns>Строка с сообщением</returns>
    private static string GetResultMessage(int winner, bool isOver)
    {
        if (!isOver) return "Game in progress";
        if (winner == 0) return "Draw!";
        if (winner == 1) return "You win!";
        return "Computer wins!";
    }
}
