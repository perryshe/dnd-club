using tic_tac.domain.model;

namespace tic_tac.domain.service;

/// <summary>
/// Интерфейс сервиса игры.
/// Описывает методы для работы с игрой: ходы, валидация, проверка окончания.
/// </summary>
public interface IGameService
{
    /// <summary>
    /// Возвращает оптимальный ход компьютера для текущего состояния игры.
    /// Использует алгоритм Minimax для выбора лучшего хода.
    /// </summary>
    /// <param name="game">Текущая игра</param>
    /// <returns>Кортеж (строка, столбец) — координаты хода компьютера</returns>
    (int row, int col) GetNextMove(Game game);

    /// <summary>
    /// Проверяет, что доска не была изменена нелегально.
    /// Сравнивает текущее состояние с оригинальной доской.
    /// </summary>
    /// <param name="game">Текущая игра</param>
    /// <param name="originalBoard">Доска до хода игрока</param>
    /// <returns>true если доска не изменена, false если обнаружено читерство</returns>
    bool ValidateBoard(Game game, int[,] originalBoard);

    /// <summary>
    /// Проверяет, закончилась ли игра.
    /// </summary>
    /// <param name="game">Текущая игра</param>
    /// <returns>
    /// Кортеж (winner, isOver):
    /// - winner: 0 = ничья/игра идёт, 1 = победил игрок, 2 = победил компьютер
    /// - isOver: true если игра окончена
    /// </returns>
    (int winner, bool isOver) CheckGameOver(Game game);
}
