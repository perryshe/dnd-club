namespace tic_tac.datasource.model;

/// <summary>
/// Модель игрового поля для слоя datasource.
/// Используется для хранения состояния доски.
/// </summary>
public class BoardModel
{
    /// <summary>
    /// Двумерный массив значений поля.
    /// 0 = пустая клетка, 1 = игрок, 2 = компьютер.
    /// </summary>
    // public int[,] Board { get; set; }
    public List<List<int>> Board { get; set; }
    /// <summary>
    /// Размер поля.
    /// </summary>
    public int Size { get; set; }

    /// <summary>
    /// Конструктор по умолчанию — создаёт пустое поле 3x3.
    /// </summary>
    public BoardModel()
    {
        Size = 3;
        // Board = new int[Size, Size];
        Board = new List<List<int>>(Size);
        for (int i = 0; i < Size; i++) Board.Add(new List<int>(new int[Size]));
    }

    /// <summary>
    /// Конструктор с указанием размера поля.
    /// </summary>
    /// <param name="size">Размер поля (size x size)</param>
    public BoardModel(int size)
    {
        Size = size;
        // Board = new int[size, size];
        Board = new List<List<int>>(size);
        for (int i = 0; i < size; i++) Board.Add(new List<int>(new int[size]));
    }

    /// <summary>
    /// Конструктор копирования — создаёт копию существующего массива.
    /// </summary>
    /// <param name="board">Массив для копирования</param>
    public BoardModel(int[,] board)
    {
        Size = board.GetLength(0);
        // Board = new int[Size, Size];
        Board = new List<List<int>>(Size);
        for (int i = 0; i < Size; i++)
        {
            var row = new List<int>(Size);
            for (int j = 0; j < Size; j++)
                row.Add(board[i, j]);
            Board.Add(row);
        }
            
    }

    public BoardModel(List<List<int>>board)
    {
        Size = board.Count;
        Board = board.Select(row => new List<int>(row)).ToList();
    }
}
