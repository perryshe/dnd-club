using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tic_tac.domain.service;
using tic_tac.web.model;

namespace tic_tac.web.controller;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public ActionResult Register([FromBody] SignUpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Login) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { error = "Login and password are required" });

        if (request.Login.Length < 3 || request.Login.Length > 20)
            return BadRequest(new { error = "Login must be 3-20 characters" });

        if (request.Password.Length < 4)
            return BadRequest(new { error = "Password must be at least 4 characters" });

        var success = _userService.Register(request.Login, request.Password);
        if (!success)
            return Conflict(new { error = "Login already exists" });

        return Ok(new { message = "Registered successfully" });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public ActionResult Login()
    {
        var authHeader = Request.Headers.Authorization.FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
            return Unauthorized(new { error = "Missing or invalid Authorization header" });

        try
        {
            var base64 = authHeader["Basic ".Length..].Trim();
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(base64));
            var parts = decoded.Split(':', 2);
            if (parts.Length != 2)
                return Unauthorized(new { error = "Invalid credentials format" });

            var userId = _userService.Authorize(parts[0], parts[1]);
            if (userId == null)
                return Unauthorized(new { error = "Invalid login or password" });

            return Ok(new UserResponse { Id = userId.Value, Login = parts[0] });
        }
        catch
        {
            return Unauthorized(new { error = "Invalid Authorization header" });
        }
    }

    [AllowAnonymous]
    [HttpPost("auto-login")]
    public ActionResult AutoLogin([FromBody] AutoLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Login))
            return BadRequest(new { error = "Login is required" });

        var user = _userService.FindOrCreate(request.Login);
        if (user == null)
            return BadRequest(new { error = "Failed to create user" });

        return Ok(new UserResponse { Id = user.Id, Login = user.Login });
    }
}
