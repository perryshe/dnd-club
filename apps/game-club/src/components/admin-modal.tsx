"use client"

import { useState, useRef } from "react"

type Game = { id: string; name: string; time: string | null; players: string | null; age: string | null; year: number | null; isExp: boolean; image: string | null }

export default function AdminModal({ game, onSave, onClose }: {
  game: Game | null; onSave: (data: Partial<Game> & { id?: string }) => void; onClose: () => void
}) {
  const [name, setName] = useState(game?.name || "")
  const [time, setTime] = useState(game?.time || "")
  const [players, setPlayers] = useState(game?.players || "")
  const [age, setAge] = useState(game?.age || "")
  const [year, setYear] = useState(String(game?.year || ""))
  const [isExp, setIsExp] = useState(game?.isExp || false)
  const [image, setImage] = useState(game?.image || "")
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/g21/api/upload", { method: "POST", body: fd })
    if (res.ok) {
      const data = await res.json()
      setImage(data.filename)
    }
    setUploading(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      id: game?.id, name, time, players, age,
      year: year ? parseInt(year) : undefined,
      isExp, image: image || null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-[460px] max-w-[92vw] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-[11px] font-semibold tracking-[1.5px] text-cyan-400 mb-4 font-mono uppercase">
          {game ? "✏️ Редактировать" : "＋ Добавить игру"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-[10px] text-slate-500 font-mono block mb-1">Название</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-mono block mb-1">Время</label>
            <input value={time} onChange={e => setTime(e.target.value)} placeholder="~30 мин" className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-mono block mb-1">Игроки</label>
            <input value={players} onChange={e => setPlayers(e.target.value)} placeholder="2—4" className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-mono block mb-1">Возраст</label>
            <input value={age} onChange={e => setAge(e.target.value)} placeholder="10+" className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-500/50" />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-mono block mb-1">Год</label>
            <input value={year} onChange={e => setYear(e.target.value)} placeholder="2020" className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-500/50" />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" id="isExp" checked={isExp} onChange={e => setIsExp(e.target.checked)} className="accent-cyan-500" />
            <label htmlFor="isExp" className="text-[10px] text-slate-500 font-mono">Дополнение</label>
          </div>

          <div className="col-span-2">
            <label className="text-[10px] text-slate-500 font-mono block mb-1">Изображение</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-400 font-mono hover:border-cyan-500/50 hover:text-cyan-400 transition disabled:opacity-50">
                {uploading ? "⏳ Загрузка..." : "📁 Выбрать файл"}
              </button>
              <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
              {image && <span className="text-[10px] text-slate-500 font-mono truncate max-w-[180px]">{image}</span>}
            </div>
            {image && (
              <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                <img src={`/g21/images/${image}`} alt="preview" className="w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
              </div>
            )}
          </div>

          <div className="col-span-2 flex gap-2 mt-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-mono tracking-wider uppercase text-white font-semibold transition">
              💾 Сохранить
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400 hover:text-white transition">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
