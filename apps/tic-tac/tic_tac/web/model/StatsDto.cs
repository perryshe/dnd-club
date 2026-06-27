namespace tic_tac.web.model;

public class RecordResultRequest
{
    public int Result { get; set; }
}

public class LeaderboardEntry
{
    public string Login { get; set; } = string.Empty;
    public int Wins { get; set; }
    public int Losses { get; set; }
    public int Draws { get; set; }
    public int Total { get; set; }
}
