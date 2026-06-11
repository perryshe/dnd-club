using tic_tac.domain.model;

namespace tic_tac.domain.service;

public interface IUserService
{
    bool Register(string login, string password);
    Guid? Authorize(string login, string password);
    User? GetById(Guid id);
    User? FindOrCreate(string login);
    string? GetUserLogin(Guid userId);
}
