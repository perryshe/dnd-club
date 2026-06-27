using tic_tac.domain.model;

namespace tic_tac.domain.service;

/// <summary>
/// Реализация сервиса игры.
/// Содержит логику Minimax, валидацию и проверку окончания игры.
/// </summary>
public class GameService : IGameService
{
    // Константы для удобства — вместо "магических чисел" 0, 1, 2
    private const int PLAYER = 1;    // Крестик
    private const int COMPUTER = 2;  // Нолик
    private const int EMPTY = 0;     // Пустая клетка

    /// <summary>
    /// Возвращает оптимальный ход компьютера.
    /// Алгоритм: перебирает все возможные ходы и выбирает лучший по Minimax.
    /// </summary>
    public (int row, int col) GetComputerMove(Game game)
    {
        var board = game.Board;
        var emptyCells = board.GetEmptyCells();

        // Если поле заполнено — ход невозможен
        if (emptyCells.Count == 0)
            return (-1, -1);

        int bestScore = int.MinValue;  // Начальное значение — минус бесконечность
        (int, int) bestMove = emptyCells[0];  // Первый ход по умолчанию

        // Перебираем все пустые клетки
        foreach (var cell in emptyCells)
        {
            // 1. Делаем "пробный" ход компьютера
            board.SetCell(cell.row, cell.col, COMPUTER);

            // 2. Оцениваем позицию через Minimax
            int score = Minimax(board, 0, false);

            // 3. Отменяем пробный ход (ставим пустую клетку обратно)
            board.SetCell(cell.row, cell.col, EMPTY);

            // 4. Если этот ход лучше — запоминаем его
            if (score > bestScore)
            {
                bestScore = score;
                bestMove = cell;
            }
        }

        return bestMove;
    }

    /// <summary>
    /// Алгоритм Minimax — рекурсивный поиск лучшего хода.
    /// Играет все возможные партии и оценивает результат.
    /// 
    /// Принцип работы:
    /// - Компьютер MAXIMIZING — пытается получить максимальный счёт (победа = +10)
    /// - Игрок MINIMIZING — пытается получить минимальный счёт (победа = -10)
    /// - Глубина (depth) учитывается: быстрая победа лучше медленной.
    /// </summary>
    /// <param name="board">Текущее поле</param>
    /// <param name="depth">Глубина рекурсии (ход number)</param>
    /// <param name="isMaximizing">true = ход компьютера (максимизация), false = ход игрока</param>
    /// <returns>Оценка позиции: +10 победа компа, -10 победа игрока, 0 ничья</returns>
    private int Minimax(GameBoard board, int depth, bool isMaximizing)
    {
        // Базовые случаи — терминальные позиции (игра окончена)

        int? winner = CheckWinner(board);

        if (winner == COMPUTER)
            // Компьютер выиграл: +10 минус глубина (быстрая победа ценнее)
            return 10 - depth;

        if (winner == PLAYER)
            // Игрок выиграл: -10 плюс глубина (чем раньше проиграли, тем хуже)
            return depth - 10;

        if (board.GetEmptyCells().Count == 0)
            // Ничья — поле заполнено, никто не выиграл
            return 0;

        var emptyCells = board.GetEmptyCells();

        if (isMaximizing)
        {
            // Ход компьютера — максимизируем счёт (ищем максимум)
            int bestScore = int.MinValue;

            foreach (var cell in emptyCells)
            {
                board.SetCell(cell.row, cell.col, COMPUTER);
                int score = Minimax(board, depth + 1, false);  // Переключаем на ход игрока
                board.SetCell(cell.row, cell.col, EMPTY);
                bestScore = Math.Max(score, bestScore);  // Берём максимум
            }
            return bestScore;
        }
        else
        {
            // Ход игрока — минимизируем счёт (ищем минимум)
            int bestScore = int.MaxValue;

            foreach (var cell in emptyCells)
            {
                board.SetCell(cell.row, cell.col, PLAYER);
                int score = Minimax(board, depth + 1, true);  // Переключаем на ход компьютера
                board.SetCell(cell.row, cell.col, EMPTY);
                bestScore = Math.Min(score, bestScore);  // Берём минимум
            }
            return bestScore;
        }
    }

    /// <summary>
    /// Проверяет, есть ли победитель.
    /// Проверяет все 8 линий: 3 строки + 3 столбца + 2 диагонали.
    /// </summary>
    /// <returns>null если победителя нет, иначе 1 или 2</returns>
    private int? CheckWinner(GameBoard board)
    {
        int size = board.Size;

        // Проверка строк
        // Если все три клетки строки одинаковые и не пустые — победитель найден
        for (int i = 0; i < size; i++)
        {
            if (board.GetCell(i, 0) != EMPTY &&
                board.GetCell(i, 0) == board.GetCell(i, 1) &&
                board.GetCell(i, 1) == board.GetCell(i, 2))
                return board.GetCell(i, 0);
        }

        // Проверка столбцов
        for (int j = 0; j < size; j++)
        {
            if (board.GetCell(0, j) != EMPTY &&
                board.GetCell(0, j) == board.GetCell(1, j) &&
                board.GetCell(1, j) == board.GetCell(2, j))
                return board.GetCell(0, j);
        }

        // Главная диагональ (верхний левый → нижний правый)
        // Пример: [0,0], [1,1], [2,2]
        if (board.GetCell(0, 0) != EMPTY &&
            board.GetCell(0, 0) == board.GetCell(1, 1) &&
            board.GetCell(1, 1) == board.GetCell(2, 2))
            return board.GetCell(0, 0);

        // Побочная диагональ (верхний правый → нижний левый)
        // Пример: [0,2], [1,1], [2,0]
        if (board.GetCell(0, 2) != EMPTY &&
            board.GetCell(0, 2) == board.GetCell(1, 1) &&
            board.GetCell(1, 1) == board.GetCell(2, 0))
            return board.GetCell(0, 2);

        // Никто не выиграл
        return null;
    }

    public int GetSymbolForPlayer(Game game, Guid userId)
    {
        if (userId == game.PlayerXId) return 1;   // X
        if (userId == game.PlayerOId) return 2;   // O
        return -1;  // не участник
    }

    public bool IsValidMove(Game game, int row, int col, Guid userId)
    {
        if (!game.Board.IsCellEmpty(row, col)) return false;

        var symbol = GetSymbolForPlayer(game, userId);
        if (symbol == -1) return false;

        // Правильный ли игрок ходит сейчас
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

        // Чей ход: считаем фигуры на доске
        int xCount = 0, oCount = 0;
        for (int i = 0; i < game.Board.Size; i++)
            for (int j = 0; j < game.Board.Size; j++)
            {
                if (game.Board.GetCell(i, j) == 1) xCount++;
                if (game.Board.GetCell(i, j) == 2) oCount++;
            }
        // X ходит первым, значит если X == O → ход X, если X > O → ход O
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
            game.Board.SetCell(row, col, 2);  // computer = O = 2
        game.State = DetermineState(game);
    }
}
