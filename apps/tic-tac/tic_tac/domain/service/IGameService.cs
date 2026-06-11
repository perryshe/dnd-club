using tic_tac.domain.model;

namespace tic_tac.domain.service;

public interface IGameService
{
    (int row, int col) GetComputerMove(Game game);
    void ApplyMove(Game game, int row, int col, int symbol);
    void ApplyComputerMove(Game game);
    GameState DetermineState(Game game);
    bool IsValidMove(Game game, int row, int col, Guid userId);
    int GetSymbolForPlayer(Game game, Guid userId);
    (int winner, bool isOver) CheckGameOver(Game game);
}
