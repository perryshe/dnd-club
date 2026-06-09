namespace tic_tac.web.model;

/// <summary>
/// DTO (Data Transfer Object) для игрового поля.
/// Используется для передачи данных между клиентом и сервером через JSON.
/// </summary>
public class BoardDto
{
    /// <summary>
    /// Jagged массив значений поля.
    /// Внешний массив — строки, внутренний — столбцы.
    /// 0 = пустая клетка, 1 = игрок (X), 2 = компьютер (O).
    /// </summary>
    public int[][] Board { get; set; }

    /// <summary>
    /// Размер поля (по умолчанию 3).
    /// </summary>
    public int Size { get; set; }

    /// <summary>
    /// Конструктор по умолчанию — создаёт пустое поле 3x3.
    /// </summary>
    public BoardDto()
    {
        Size = 3;
        Board = new int[Size][];
        for (int i = 0; i < Size; i++)
            Board[i] = new int[Size];
    }

    /// <summary>
    /// Конструктор с указанием размера поля.
    /// </summary>
    /// <param name="size">Размер поля (size x size)</param>
    public BoardDto(int size)
    {
        Size = size;
        Board = new int[size][];
        for (int i = 0; i < size; i++)
            Board[i] = new int[size];
    }
}
