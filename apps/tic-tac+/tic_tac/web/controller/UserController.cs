using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tic_tac.datasource;
using tic_tac.web.auth;
using tic_tac.web.model;

namespace tic_tac.web.controller;

[ApiController]
[Route("api/[controller]")]
[UserAuthenticator]
public class UserController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        if (HttpContext.Items["UserId"] is not Guid userId)
            return Unauthorized();

        var user = await _dbContext.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { error = "User not found" });

        return Ok(new UserDto { Id = user.Id, Login = user.Login });
    }
}