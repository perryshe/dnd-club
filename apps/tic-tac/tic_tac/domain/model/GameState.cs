namespace tic_tac.domain.model;

public enum GameState
{
    WaitingForPlayers,
    PlayerXTurn,
    PlayerOTurn,
    PlayerXWin,
    PlayerOWin,
    Draw
}

public enum GameType
{
    VsComputer,
    VsPlayer
}
