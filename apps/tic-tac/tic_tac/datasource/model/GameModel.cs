using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace tic_tac.datasource.model;

[Table("games")]
public class GameModel
{
    [Key]
    public Guid Id { get; set; }
    public string BoardJson { get; set; }

    public GameModel() { BoardJson = "{}"; }
    public GameModel(Guid id, string boardJson) { Id = id; BoardJson = boardJson; }
}
