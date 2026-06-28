"use client"

type Game = { id: string; name: string; time: string | null; players: string | null; age: string | null; image: string | null }
type VoteCounts = Record<string, { up: number; down: number }>

export default function VoteSection({
  games, votes, sessionUserId, onVote,
}: {
  games: Game[]; votes: VoteCounts; sessionUserId?: string | null; onVote: (gid: string, d: "up" | "down") => void
}) {
  const scored = games
    .map(g => ({ game: g, score: (votes[g.id]?.up || 0) - (votes[g.id]?.down || 0) }))
    .filter(s => s.score !== 0)
    .sort((a, b) => b.score - a.score)

  const top = scored[0]

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <span className="text-slate-600 font-mono text-[10px] tracking-[0.3em] uppercase">// voting</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
      </div>

      {top && top.score > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-center">
          <span className="text-lg mr-2">🏆</span>
          <span className="font-semibold text-cyan-400">{top.game.name}</span>
          <span className="text-slate-500 text-sm ml-2 font-mono">лидер · {top.score} баллов</span>
        </div>
      )}

      {scored.length === 0 ? (
        <div className="text-center py-16 text-slate-600 font-mono text-sm">// ГОЛОСОВ НЕТ //</div>
      ) : (
        <div className="space-y-2">
          {scored.map(({ game, score }) => (
            <div key={game.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/30 border border-slate-800/60 hover:border-slate-700/60 transition">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                {game.image ? (
                  <img src={`/g21/images/${game.image}`} alt="" className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLElement).style.display = "none" }}
                  />
                ) : <div className="w-full h-full flex items-center justify-center text-lg opacity-30">🎲</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-200 truncate">{game.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {game.time && <span>⏱ {game.time} </span>}
                  {game.players && <span>👥 {game.players} </span>}
                  {game.age && <span>🔞 {game.age}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-lg font-mono font-bold min-w-[24px] text-center ${score > 0 ? "text-amber-400" : "text-slate-600"}`}>{score}</span>
                <button onClick={() => onVote(game.id, "up")} className="text-xs px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:border-amber-500 hover:text-amber-400 transition font-mono">▲</button>
                <button onClick={() => onVote(game.id, "down")} className="text-xs px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition font-mono">▼</button>
                <span className="text-[10px] text-slate-600 font-mono">
                  <span className="text-amber-500">+{votes[game.id]?.up || 0}</span>
                  <span className="mx-1">/</span>
                  <span className="text-red-500">−{votes[game.id]?.down || 0}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4 text-[10px] text-slate-600 font-mono">· 1 голос на игру · повтор — отмена</div>
    </>
  )
}
