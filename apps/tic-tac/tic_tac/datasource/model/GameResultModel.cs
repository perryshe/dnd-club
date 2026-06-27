using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tic_tac.datasource.model;

[Table("game_results")]
public class GameResultModel
{
    [Key]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int Result { get; set; }
    public DateTime Timestamp { get; set; }

    public GameResultModel()
    {
        Id = Guid.NewGuid();
        Timestamp = DateTime.UtcNow;
    }

    public GameResultModel(Guid id, Guid userId, int result, DateTime timestamp)
    {
        Id = id;
        UserId = userId;
        Result = result;
        Timestamp = timestamp;
    }
}
