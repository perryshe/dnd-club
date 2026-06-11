using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tic_tac.domain.service;
using tic_tac.web.model;

namespace tic_tac.web.controller;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<bool>> Register([FromBody] SignUpRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<Guid>> Login()
    {
        var userId = await _authService.AuthorizeAsync(Request);
        if (userId == null)
            return Unauthorized(new { error = "Invalid credentials" });
        return Ok(userId.Value);
    }
}