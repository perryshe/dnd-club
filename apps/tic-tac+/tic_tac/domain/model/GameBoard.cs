namespace tic_tac.domain.model;

/// <summary>
/// Модель игрового поля для крестиков-ноликов.
/// Хранит состояние доски в виде двумерного массива целых чисел.
/// </summary>
public class GameBoard
{
    /// <summary>
    /// Двумерный массив, где:
    /// 0 = пустая клетка, 1 = крестик (игрок), 2 = нолик (компьютер).
    /// </summary>
    public int[,] Board { get; }

    /// <summary>
    /// Размер поля (по умолчанию 3 для классического крестики-нолики).
    /// </summary>
    public int Size { get; }

    /// <summary>
    /// Конструктор: создаёт пустое поле заданного размера.
    /// По умолчанию создаёт поле 3x3, заполненное нулями (пустыми клетками).
    /// </summary>
    /// <param name="size">Размер поля (по умолчанию 3)</param>
    public GameBoard(int size = 3)
    {
        Size = size;
        Board = new int[size, size];
    }

    /// <summary>
    /// Конструктор копирования: создаёт копию существующего поля.
    /// Важно! Копируем данные, чтобы защитить оригинал от изменений.
    /// </summary>
    /// <param name="board">Массив для копирования</param>
    public GameBoard(int[,] board)
    {
        Size = board.GetLength(0);
        Board = new int[Size, Size];
        for (int i = 0; i < Size; i++)
            for (int j = 0; j < Size; j++)
                Board[i, j] = board[i, j];
    }

    /// <summary>
    /// Проверяет, пустая ли клетка.
    /// </summary>
    /// <param name="row">Строка (0, 1 или 2)</param>
    /// <param name="col">Столбец (0, 1 или 2)</param>
    /// <returns>true если клетка пустая (значение 0)</returns>
    public bool IsCellEmpty(int row, int col)
    {
        return Board[row, col] == 0;
    }

    /// <summary>
    /// Устанавливает значение в клетку.
    /// </summary>
    /// <param name="row">Строка</param>
    /// <param name="col">Столбец</param>
    /// <param name="player">1 для игрока, 2 для компьютера</param>
    public void SetCell(int row, int col, int player)
    {
        Board[row, col] = player;
    }

    /// <summary>
    /// Получает значение клетки.
    /// </summary>
    /// <param name="row">Строка</param>
    /// <param name="col">Столбец</param>
    /// <returns>0, 1 или 2</returns>
    public int GetCell(int row, int col)
    {
        return Board[row, col];
    }

    /// <summary>
    /// Возвращает список всех пустых клеток.
    /// Нужен для алгоритма Minimax — чтобы знать куда можно походить.
    /// </summary>
    /// <returns>Список кортежей (строка, столбец)</returns>
    public List<(int row, int col)> GetEmptyCells()
    {
        var emptyCells = new List<(int, int)>();
        for (int i = 0; i < Size; i++)
            for (int j = 0; j < Size; j++)
                if (Board[i, j] == 0)
                    emptyCells.Add((i, j));
        return emptyCells;
    }

    /// <summary>
    /// Очищает поле — заполняет всё нулями.
    /// Используется для начала новой игры.
    /// </summary>
    public void Clear()
    {
        for (int i = 0; i < Size; i++)
            for (int j = 0; j < Size; j++)
                Board[i, j] = 0;
    }

    /// <summary>
    /// Конвертирует двумерный массив int[,] в jagged массив int[][].
    /// Нужен для JSON сериализации (int[,] не сериализуется стандартным JSON).
    /// </summary>
    /// <returns>Jagged массив для сериализации</returns>
    public int[][] ToJaggedArray()
    {
        var result = new int[Size][];
        for (int i = 0; i < Size; i++)
        {
            result[i] = new int[Size];
            for (int j = 0; j < Size; j++)
                result[i][j] = Board[i, j];
        }
        return result;
    }
}
