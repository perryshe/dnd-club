using tic_tac.domain.model;

namespace tic_tac.domain.service;

public class GameService : IGameService
{
    private const int PLAYER = 1;
    private const int COMPUTER = 2;
    private const int EMPTY = 0;

    private static readonly Random _rng = new();

    public (int row, int col) GetComputerMove(Game game)
    {
        var board = game.Board;
        var emptyCells = board.GetEmptyCells();

        if (emptyCells.Count == 0)
            return (-1, -1);

        if (_rng.Next(100) < 30)
        {
            return emptyCells[_rng.Next(emptyCells.Count)];
        }

        int bestScore = int.MinValue;
        (int, int) bestMove = emptyCells[0];

        foreach (var cell in emptyCells)
        {
            board.SetCell(cell.row, cell.col, COMPUTER);
            int score = Minimax(board, 0, false);
            board.SetCell(cell.row, cell.col, EMPTY);

            if (score > bestScore)
            {
                bestScore = score;
                bestMove = cell;
            }
        }

        return bestMove;
    }

    private int Minimax(GameBoard board, int depth, bool isMaximizing)
    {
        int? winner = CheckWinner(board);

        if (winner == COMPUTER)
            return 10 - depth;
        if (winner == PLAYER)
            return depth - 10;
        if (board.GetEmptyCells().Count == 0)
            return 0;

        var emptyCells = board.GetEmptyCells();

        if (isMaximizing)
        {
            int bestScore = int.MinValue;
            foreach (var cell in emptyCells)
            {
                board.SetCell(cell.row, cell.col, COMPUTER);
                int score = Minimax(board, depth + 1, false);
                board.SetCell(cell.row, cell.col, EMPTY);
                bestScore = Math.Max(score, bestScore);
            }
            return bestScore;
        }
        else
        {
            int bestScore = int.MaxValue;
            foreach (var cell in emptyCells)
            {
                board.SetCell(cell.row, cell.col, PLAYER);
                int score = Minimax(board, depth + 1, true);
                board.SetCell(cell.row, cell.col, EMPTY);
                bestScore = Math.Min(score, bestScore);
            }
            return bestScore;
        }
    }

    private int? CheckWinner(GameBoard board)
    {
        int size = board.Size;

        for (int i = 0; i < size; i++)
        {
            if (board.GetCell(i, 0) != EMPTY &&
                board.GetCell(i, 0) == board.GetCell(i, 1) &&
                board.GetCell(i, 1) == board.GetCell(i, 2))
                return board.GetCell(i, 0);
        }

        for (int j = 0; j < size; j++)
        {
            if (board.GetCell(0, j) != EMPTY &&
                board.GetCell(0, j) == board.GetCell(1, j) &&
                board.GetCell(1, j) == board.GetCell(2, j))
                return board.GetCell(0, j);
        }

        if (board.GetCell(0, 0) != EMPTY &&
            board.GetCell(0, 0) == board.GetCell(1, 1) &&
            board.GetCell(1, 1) == board.GetCell(2, 2))
            return board.GetCell(0, 0);

        if (board.GetCell(0, 2) != EMPTY &&
            board.GetCell(0, 2) == board.GetCell(1, 1) &&
            board.GetCell(1, 1) == board.GetCell(2, 0))
            return board.GetCell(0, 2);

        return null;
    }

    public int GetSymbolForPlayer(Game game, Guid userId)
    {
        if (userId == game.PlayerXId) return 1;
        if (userId == game.PlayerOId) return 2;
        return -1;
    }

    public bool IsValidMove(Game game, int row, int col, Guid userId)
    {
        if (!game.Board.IsCellEmpty(row, col)) return false;
        var symbol = GetSymbolForPlayer(game, userId);
        if (symbol == -1) return false;
        if (game.State == GameState.PlayerXTurn && symbol != 1) return false;
        if (game.State == GameState.PlayerOTurn && symbol != 2) return false;
        return true;
    }

    public GameState DetermineState(Game game)
    {
        int? winner = CheckWinner(game.Board);
        if (winner == 1) return GameState.PlayerXWin;
        if (winner == 2) return GameState.PlayerOWin;
        if (game.Board.GetEmptyCells().Count == 0) return GameState.Draw;

        int xCount = 0, oCount = 0;
        for (int i = 0; i < game.Board.Size; i++)
            for (int j = 0; j < game.Board.Size; j++)
            {
                if (game.Board.GetCell(i, j) == 1) xCount++;
                if (game.Board.GetCell(i, j) == 2) oCount++;
            }
        return xCount > oCount ? GameState.PlayerOTurn : GameState.PlayerXTurn;
    }

    public void ApplyMove(Game game, int row, int col, int symbol)
    {
        game.Board.SetCell(row, col, symbol);
        game.State = DetermineState(game);
    }

    public void ApplyComputerMove(Game game)
    {
        var (row, col) = GetComputerMove(game);
        if (row >= 0 && col >= 0)
            game.Board.SetCell(row, col, 2);
        game.State = DetermineState(game);
    }

    public (int winner, bool isOver) CheckGameOver(Game game)
    {
        int? winner = CheckWinner(game.Board);

        if (winner.HasValue)
            return (winner.Value, true);

        if (game.Board.GetEmptyCells().Count == 0)
            return (0, true);

        return (0, false);
    }
}
