using tic_tac.web.model;

namespace tic_tac.domain.service;

public interface IAuthService
{
    Task<bool> RegisterAsync(SignUpRequest request);
    Task<Guid?> AuthorizeAsync(HttpRequest request);
}