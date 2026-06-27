"use client"

import { useState } from "react"
import AdminModal from "./admin-modal"

type Game = { id: string; name: string; time: string | null; players: string | null; age: string | null; year: number | null; isExp: boolean; image: string | null }
type VoteCounts = Record<string, { up: number; down: number }>
type WishEntry = { id: string; gameId: string }

export default function Collection({
  games, votes, wishes, nextMeeting, sessionUserId, isAdmin, onVote, onWish, onSave, onDelete,
}: {
  games: Game[]; votes: VoteCounts; wishes: WishEntry[]; nextMeeting?: { id: string; date: string; allGames: boolean; games: { game: Game }[] } | null
  sessionUserId?: string | null; isAdmin: boolean
  onVote: (gid: string, d: "up" | "down") => void; onWish: (gid: string) => void
  onSave: (d: Partial<Game> & { id?: string }) => void; onDelete: (id: string) => void
}) {
  const [editGame, setEditGame] = useState<Game | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const wishIds = new Set(wishes.map(w => w.gameId))
  const meetingGameIds = nextMeeting?.allGames
    ? new Set(games.map(g => g.id))
    : new Set(nextMeeting?.games.map(g => g.game.id) ?? [])

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <span className="text-slate-600 font-mono text-[10px] tracking-[0.3em] uppercase">// collection</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        {isAdmin && (
          <button
            onClick={() => { setEditGame(null); setShowAdd(true) }}
            className="text-[10px] font-mono tracking-wider uppercase text-cyan-500/70 hover:text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 px-3 py-1.5 rounded-lg transition"
          >
            + добавить
          </button>
        )}
      </div>

      {!nextMeeting && (
        <div className="text-center py-8 text-slate-600 font-mono text-[10px] tracking-[0.2em] uppercase mb-6">
          // нет ближайшей встречи — вишлист недоступен
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {games.map(game => {
          const v = votes[game.id] || { up: 0, down: 0 }
          const score = v.up - v.down
          const wished = wishIds.has(game.id)
          const canWish = meetingGameIds.has(game.id)

          return (
            <div
              key={game.id}
              className="group relative bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden hover:border-slate-700/60 transition-all duration-200 hover:translate-y-[-2px]"
            >
              <div className="aspect-[4/3] bg-slate-800/50 flex items-center justify-center overflow-hidden">
                {game.image ? (
                  <img
                    src={`/g21/images/${game.image}`}
                    alt={game.name}
                    className="w-full h-full object-cover opacity-0 transition-opacity duration-300"
                    onLoad={e => (e.currentTarget as HTMLImageElement).classList.add("opacity-100")}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; (e.currentTarget.nextElementSibling as HTMLElement).style.display = "flex" }}
                  />
                ) : null}
                <span className="text-3xl opacity-20 hidden" style={game.image ? {} : { display: "flex" }}>🎲</span>
              </div>

              <div className="p-3">
                <h3 className="text-xs font-semibold text-slate-200 leading-tight mb-2 line-clamp-2">{game.name}</h3>
                <div className="flex flex-wrap gap-1 mb-2">
                  {game.time && <span className="text-[9px] text-slate-500 font-mono">⏱ {game.time}</span>}
                  {game.players && <span className="text-[9px] text-slate-500 font-mono">👥 {game.players}</span>}
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => onVote(game.id, "up")} className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:border-amber-500 hover:text-amber-400 transition font-mono">▲</button>
                  <span className={`text-xs font-mono min-w-[20px] text-center ${score > 0 ? "text-amber-400" : "text-slate-600"}`}>{score}</span>
                  <button onClick={() => onVote(game.id, "down")} className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition font-mono">▼</button>
                  {canWish ? (
                    <button
                      onClick={() => onWish(game.id)}
                      className={`ml-auto text-sm px-2 py-1 rounded border transition font-mono ${
                        wished ? "bg-pink-950/30 border-pink-500/40 text-pink-400" : "bg-slate-800 border-slate-700 text-slate-500 hover:border-pink-500/40 hover:text-pink-400"
                      }`}
                      title={wished ? "в вишлисте" : "+ вишлист"}
                    >
                      {wished ? "♥" : "♡"}
                    </button>
                  ) : (
                    <span className="ml-auto text-sm px-2 py-1 rounded border border-slate-800/40 text-slate-700 font-mono">♡</span>
                  )}
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800/60">
                  <span className={`text-[9px] font-mono uppercase ${game.isExp ? "text-cyan-500/60" : "text-purple-500/60"}`}>
                    {game.isExp ? "доп" : "игра"}
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono">{game.year || "—"}</span>
                </div>

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => { setEditGame(game); setShowAdd(true) }} className="text-[10px] px-2 py-1 rounded bg-black/70 border border-slate-700 text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition">✏️</button>
                    <button onClick={() => { if (confirm(`Удалить «${game.name}»?`)) onDelete(game.id) }} className="text-[10px] px-2 py-1 rounded bg-black/70 border border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition">🗑</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showAdd && (
        <AdminModal
          game={editGame}
          onSave={(data) => { onSave(data); setShowAdd(false) }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  )
}