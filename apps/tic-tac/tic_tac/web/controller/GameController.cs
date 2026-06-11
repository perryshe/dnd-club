using Microsoft.AspNetCore.Mvc;
using tic_tac.datasource;
using tic_tac.datasource.mapper;
using tic_tac.datasource.model;
using tic_tac.domain.model;
using tic_tac.domain.service;
using tic_tac.web.auth;
using tic_tac.web.mapper;
using tic_tac.web.model;

namespace tic_tac.web.controller;

[ApiController]
[Route("api/[controller]")]
[UserAuthenticator]
public class GameController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly IUserService _userService;
    private readonly AppDbContext _dbContext;
    private readonly IGameMapper _gameMapper;
    private readonly IGameWebMapper _mapper;

    public GameController(IGameService gameService, IUserService userService,
        AppDbContext dbContext, IGameWebMapper mapper, IGameMapper gameMapper)
    {
        _gameService = gameService;
        _userService = userService;
        _dbContext = dbContext;
        _mapper = mapper;
        _gameMapper = gameMapper;
    }

    [HttpPost]
    public ActionResult<GameDto> CreateGame([FromBody] CreateGameRequest request)
    {
        if (HttpContext.Items["UserId"] is not Guid userId)
            return Unauthorized();

        var gameType = Enum.Parse<GameType>(request.GameType);
        var game = new Game(Guid.NewGuid(), gameType, userId);
        _dbContext.Games.Add(_gameMapper.ToDataModel(game));
        _dbContext.SaveChanges();
        return Ok(_mapper.ToDto(game, userId));
    }

    [HttpGet("available")]
    public ActionResult<List<object>> GetAvailableGames()
    {
        if (HttpContext.Items["UserId"] is not Guid userId)
            return Unauthorized();

        var games = _dbContext.Games
            .Where(g => g.State == "WaitingForPlayers"
                     && g.GameType == "VsPlayer"
                     && g.PlayerOId == null
                     && g.PlayerXId != userId)
            .ToList();

        var result = games.Select(g =>
        {
            var creatorLogin = _userService.GetUserLogin(g.PlayerXId!.Value) ?? "unknown";
            return new { GameId = g.Id, CreatorLogin = creatorLogin };
        }).ToList();

        return Ok(result);
    }

    [HttpPost("{id:guid}/join")]
    public ActionResult<GameDto> JoinGame(Guid id)
    {
        if (HttpContext.Items["UserId"] is not Guid userId)
            return Unauthorized();

        var gameModel = _dbContext.Games.Find(id);
        if (gameModel == null)
            return NotFound(new { error = "Game not found" });
        if (gameModel.State != "WaitingForPlayers")
            return BadRequest(new { error = "Game is not joinable" });
        if (gameModel.PlayerOId != null)
            return BadRequest(new { error = "Game already has two players" });
        if (gameModel.PlayerXId == userId)
            return BadRequest(new { error = "Cannot join your own game" });

        gameModel.PlayerOId = userId;
        gameModel.State = "PlayerXTurn";
        _dbContext.SaveChanges();
        var game = _gameMapper.ToDomain(gameModel);
        return Ok(_mapper.ToDto(game, userId));
    }

    [HttpGet("{id:guid}")]
    public ActionResult<GameDto> GetGame(Guid id)
    {
        if (HttpContext.Items["UserId"] is not Guid userId)
            return Unauthorized();

        var gameModel = _dbContext.Games.Find(id);
        if (gameModel == null)
            return NotFound(new { error = "Game not found" });
        return Ok(_mapper.ToDto(_gameMapper.ToDomain(gameModel), userId));
    }

    [HttpPost("{id:guid}")]
    public ActionResult<GameDto> MakeMove(Guid id, [FromBody] MoveRequest move)
    {
        if (HttpContext.Items["UserId"] is not Guid userId)
            return Unauthorized();

        var gameModel = _dbContext.Games.Find(id);
        if (gameModel == null)
            return NotFound(new { error = "Game not found" });

        var game = _gameMapper.ToDomain(gameModel);

        if (!_gameService.IsValidMove(game, move.Row, move.Col, userId))
            return BadRequest(new { error = "Invalid move" });

        var symbol = _gameService.GetSymbolForPlayer(game, userId);
        _gameService.ApplyMove(game, move.Row, move.Col, symbol);

        if (game.GameType == GameType.VsComputer && game.State == GameState.PlayerOTurn)
            _gameService.ApplyComputerMove(game);

        var updatedModel = _gameMapper.ToDataModel(game);
        gameModel.State = updatedModel.State;
        gameModel.BoardJson = updatedModel.BoardJson;
        _dbContext.SaveChanges();

        return Ok(_mapper.ToDto(game, userId));
    }
}
