using tic_tac.web.model;

namespace tic_tac.domain.service;

public interface IUserService
{
    Task<bool> RegisterAsync(SignUpRequest request);
    Task<Guid?> ValidateCredentialsAsync(string login, string password);
}