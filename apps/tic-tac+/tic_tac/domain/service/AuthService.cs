using tic_tac.web.model;

namespace tic_tac.domain.service;

public class AuthService : IAuthService
{
    private readonly IUserService _userService;

    public AuthService(IUserService userService)
    {
        _userService = userService;
    }

    public async Task<bool> RegisterAsync(SignUpRequest request)
    {
        return await _userService.RegisterAsync(request);
    }

    public async Task<Guid?> AuthorizeAsync(HttpRequest request)
    {
        var authHeader = request.Headers.Authorization.ToString();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
            return null;

        var base64 = authHeader["Basic ".Length..].Trim();
        var decoded = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(base64));
        var parts = decoded.Split(':', 2);
        if (parts.Length != 2)
            return null;

        return await _userService.ValidateCredentialsAsync(parts[0], parts[1]);
    }
}