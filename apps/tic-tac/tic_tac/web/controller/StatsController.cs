using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tic_tac.datasource;
using tic_tac.datasource.model;
using tic_tac.web.auth;
using tic_tac.web.model;

namespace tic_tac.web.controller;

[ApiController]
[Route("api/[controller]")]
[UserAuthenticator]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public StatsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [AllowAnonymous]
    [HttpGet("leaderboard")]
    public ActionResult<List<LeaderboardEntry>> GetLeaderboard()
    {
        var stats = _dbContext.GameResults
            .GroupBy(r => r.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                Wins = g.Count(r => r.Result == 1),
                Losses = g.Count(r => r.Result == -1),
                Draws = g.Count(r => r.Result == 0),
                Total = g.Count()
            })
            .OrderByDescending(s => s.Total)
            .ThenByDescending(s => s.Wins)
            .Take(3)
            .ToList();

        var userIds = stats.Select(s => s.UserId).ToList();
        var users = _dbContext.Users
            .Where(u => userIds.Contains(u.Id))
            .ToDictionary(u => u.Id, u => u.Login);

        var result = stats.Select(s => new LeaderboardEntry
        {
            Login = users.GetValueOrDefault(s.UserId, "unknown"),
            Wins = s.Wins,
            Losses = s.Losses,
            Draws = s.Draws,
            Total = s.Total
        }).ToList();

        return Ok(result);
    }

    [HttpPost("record")]
    public ActionResult RecordResult([FromBody] RecordResultRequest request)
    {
        var userId = (Guid)HttpContext.Items["UserId"]!;

        if (request.Result != 1 && request.Result != 0 && request.Result != -1)
            return BadRequest(new { error = "Result must be 1 (win), 0 (draw), or -1 (loss)" });

        var gameResult = new GameResultModel
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Result = request.Result,
            Timestamp = DateTime.UtcNow
        };

        _dbContext.GameResults.Add(gameResult);
        _dbContext.SaveChanges();

        return Ok(new { message = "Result recorded" });
    }
}
