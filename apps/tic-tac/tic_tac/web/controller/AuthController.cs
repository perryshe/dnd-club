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
    private readonly ILogger<AuthController> _logger;

    public AuthController(IUserService userService, ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
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

        string? loginAttempt = null;
        try
        {
            var base64 = authHeader["Basic ".Length..].Trim();
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(base64));
            var parts = decoded.Split(':', 2);
            if (parts.Length != 2)
                return Unauthorized(new { error = "Invalid credentials format" });

            loginAttempt = parts[0];
            var clubUser = _userService.FindClubUser(parts[0]);
            if (clubUser == null)
            {
                _logger.LogWarning("Login failed: user not found in club DB: {Login}", parts[0]);
                return Unauthorized(new { error = "Invalid login or password" });
            }

            if (clubUser.Role == "pending")
            {
                _logger.LogWarning("Login denied: role is pending for {Login}", parts[0]);
                return Unauthorized(new { error = "Account not yet approved by administrator" });
            }

            if (!BCrypt.Net.BCrypt.Verify(parts[1], clubUser.Password))
            {
                _logger.LogWarning("Login failed: wrong password for {Login}", parts[0]);
                return Unauthorized(new { error = "Invalid login or password" });
            }

            var user = _userService.AutoLink(parts[0], clubUser.Email);
            if (user == null)
                return Unauthorized(new { error = "Failed to link account" });

            _logger.LogInformation("User logged in: {Login}", user.Login);
            return Ok(new UserResponse { Id = user.Id, Login = user.Login });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login error for {Login}", loginAttempt ?? "unknown");
            return Unauthorized(new { error = "Invalid Authorization header" });
        }
    }

    [AllowAnonymous]
    [HttpPost("auto-login")]
    public ActionResult AutoLogin([FromBody] AutoLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Login) || string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { error = "Login and email are required" });

        try
        {
            var clubUser = _userService.FindClubUser(request.Login);
            if (clubUser == null)
            {
                _logger.LogWarning("Auto-login failed: {Login} not found in club DB", request.Login);
                return BadRequest(new { error = "Account not found on main site" });
            }

            if (clubUser.Role == "pending")
            {
                _logger.LogWarning("Auto-login denied: {Login} has pending role", request.Login);
                return BadRequest(new { error = "Account not yet approved by administrator" });
            }

            var user = _userService.AutoLink(request.Login, request.Email);
            if (user == null)
                return BadRequest(new { error = "Failed to link account" });

            _logger.LogInformation("Auto-login: {Login} linked", user.Login);
            return Ok(new UserResponse { Id = user.Id, Login = user.Login });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Auto-login error for {Login}", request.Login);
            return BadRequest(new { error = "Auto-login failed" });
        }
    }
}
