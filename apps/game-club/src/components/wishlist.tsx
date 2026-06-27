"use client"

type Game = { id: string; name: string; time: string | null; players: string | null; age: string | null; image: string | null }
type WishEntry = { id: string; gameId: string; game: Game }

export default function Wishlist({ wishes, onRemove }: { wishes: WishEntry[]; onRemove: (gid: string) => void }) {
  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <span className="text-slate-600 font-mono text-[10px] tracking-[0.3em] uppercase">// wishlist</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
      </div>

      {wishes.length === 0 ? (
        <div className="text-center py-16 text-slate-600 font-mono text-sm">// ВИШЛИСТ ПУСТ //</div>
      ) : (
        <div className="space-y-2">
          {wishes.map(w => (
            <div key={w.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/30 border border-slate-800/60 hover:border-slate-700/60 transition">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                {w.game.image ? (
                  <img src={`/g21/images/${w.game.image}`} alt="" className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLElement).style.display = "none" }}
                  />
                ) : <div className="w-full h-full flex items-center justify-center text-lg opacity-30">🎲</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-200 truncate">{w.game.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {w.game.time && <span>⏱ {w.game.time} </span>}
                  {w.game.players && <span>👥 {w.game.players} </span>}
                </div>
              </div>
              <button
                onClick={() => onRemove(w.gameId)}
                className="text-xs px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-500 hover:border-red-500 hover:text-red-400 transition font-mono"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
