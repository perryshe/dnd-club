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

    private static readonly Random _rng = new();

    /// <summary>
    /// Возвращает ход компьютера.
    /// С вероятностью ~30% выбирает случайную пустую клетку, иначе — оптимальный ход по Minimax.
    /// </summary>
    public (int row, int col) GetNextMove(Game game)
    {
        var board = game.Board;
        var emptyCells = board.GetEmptyCells();

        // Если поле заполнено — ход невозможен
        if (emptyCells.Count == 0)
            return (-1, -1);

        // Случайный ход с вероятностью ~5%
        if (_rng.Next(100) < 5)
        {
            return emptyCells[_rng.Next(emptyCells.Count)];
        }

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

    /// <summary>
    /// Валидация доски — проверяет, что игрок не изменил поле читерским способом.
    /// Клиент отправляет "доску до хода" + "свой ход", сервер проверяет что доска не менялась.
    /// </summary>
    /// <param name="game">Текущая игра</param>
    /// <param name="originalBoard">Доска ДО хода игрока (из запроса)</param>
    /// <returns>true если доски совпадают (всё ок), false если кто-то мухлевал</returns>
    public bool ValidateBoard(Game game, int[,] originalBoard)
    {
        var currentBoard = game.Board.Board;
        int size = game.Board.Size;

        // Побитовое сравнение каждой клетки
        for (int i = 0; i < size; i++)
        {
            for (int j = 0; j < size; j++)
            {
                if (currentBoard[i, j] != originalBoard[i, j])
                    return false;  // Нашли отличие — читерство!
            }
        }
        return true;  // Все клетки совпадают
    }

    /// <summary>
    /// Проверяет, закончилась ли игра.
    /// </summary>
    /// <returns>(winner, isOver):
    /// - winner: 0 = нет победителя, 1 = игрок, 2 = компьютер
    /// - isOver: true если игра окончена
    /// </returns>
    public (int winner, bool isOver) CheckGameOver(Game game)
    {
        int? winner = CheckWinner(game.Board);

        if (winner.HasValue)
            // Есть победитель
            return (winner.Value, true);

        if (game.Board.GetEmptyCells().Count == 0)
            // Поле заполнено, но нет победителя = ничья
            return (0, true);

        // Игра продолжается
        return (0, false);
    }
}
