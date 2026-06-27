"use client"

import { useState } from "react"

type Game = { id: string; name: string }
type MeetingData = {
  id: string; date: string; allGames: boolean
  games: { game: Game }[]
}

export default function Meetings({
  meetings, games, isAdmin, onCreateMeeting,
}: {
  meetings: MeetingData[]; games: Game[]; isAdmin: boolean
  onCreateMeeting: (date: string, allGames: boolean, gameIds: string[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10))
  const [allGames, setAllGames] = useState(true)
  const [selectedGames, setSelectedGames] = useState<string[]>([])

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    onCreateMeeting(newDate, allGames, allGames ? [] : selectedGames)
    setShowForm(false)
    setSelectedGames([])
  }

  const sorted = [...meetings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <span className="text-slate-600 font-mono text-[10px] tracking-[0.3em] uppercase">// meetings</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-[10px] font-mono tracking-wider uppercase text-cyan-500/70 hover:text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 px-3 py-1.5 rounded-lg transition"
          >
            {showForm ? "✕" : "+ новая"}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="mb-8 p-4 rounded-xl border border-dashed border-cyan-700/30 bg-cyan-950/10">
          <div className="flex gap-3 mb-3 flex-wrap">
            <input
              type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-500/50"
            />
            <label className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <input type="checkbox" checked={allGames} onChange={e => setAllGames(e.target.checked)} className="accent-cyan-500" />
              Все игры
            </label>
          </div>
          {!allGames && (
            <div className="max-h-32 overflow-y-auto flex flex-wrap gap-1 mb-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800/60">
              {games.map(g => (
                <label key={g.id} className={`text-[10px] px-2 py-1 rounded cursor-pointer border transition font-mono ${
                  selectedGames.includes(g.id)
                    ? "border-purple-500/40 bg-purple-950/30 text-purple-300"
                    : "border-slate-700/30 text-slate-500 hover:border-slate-600/50"
                }`}>
                  <input type="checkbox" className="hidden" checked={selectedGames.includes(g.id)}
                    onChange={() => setSelectedGames(prev => prev.includes(g.id) ? prev.filter(x => x !== g.id) : [...prev, g.id])}
                  />
                  {g.name}
                </label>
              ))}
            </div>
          )}
          <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-mono tracking-wider uppercase text-white font-semibold transition">
            Создать
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-slate-600 font-mono text-sm">// НЕТ ВСТРЕЧ //</div>
      ) : (
        <div className="space-y-3">
          {sorted.map(m => {
            const d = new Date(m.date)
            const future = d > new Date()
            return (
              <div key={m.id} className={`p-4 rounded-xl border transition ${
                future ? "border-cyan-500/20 bg-cyan-950/10" : "border-slate-800/60 bg-slate-900/30"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-mono font-semibold ${future ? "text-cyan-400" : "text-slate-400"}`}>
                    {d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                    future ? "text-cyan-500/70 border border-cyan-500/20" : "text-slate-600 border border-slate-700/30"
                  }`}>
                    {future ? "plan" : "done"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {m.allGames ? "Все игры" : m.games.map(g => g.game.name).join(", ")}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
