"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCharacter } from "@/lib/character-actions"

export default function CreateCharacterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await createCharacter("dead-band", new FormData(e.currentTarget))
      router.push("/dead-band")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-400 block mb-1">Имя *</label>
          <input
            name="name"
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">Раса *</label>
          <input
            name="race"
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">Класс *</label>
          <input
            name="class"
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">Уровень</label>
          <input
            name="level"
            type="number"
            min={1}
            defaultValue={1}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">HP</label>
          <input
            name="hp"
            type="number"
            min={1}
            defaultValue={10}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">Макс. HP</label>
          <input
            name="maxHp"
            type="number"
            min={1}
            defaultValue={10}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">AC</label>
          <input
            name="ac"
            type="number"
            min={1}
            defaultValue={10}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-400 block mb-2">Характеристики</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: "STR", name: "str" },
            { label: "DEX", name: "dex" },
            { label: "CON", name: "con" },
            { label: "INT", name: "int" },
            { label: "WIS", name: "wis" },
            { label: "CHA", name: "cha" },
          ].map((s) => (
            <div key={s.name}>
              <label className="text-xs text-slate-500 block mb-1">{s.label}</label>
              <input
                name={s.name}
                type="number"
                min={1}
                max={30}
                defaultValue={10}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-center focus:border-red-500 outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-400 block mb-1">Снаряжение</label>
        <textarea
          name="equipment"
          rows={3}
          placeholder="Каждый предмет с новой строки"
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400 block mb-1">Предыстория</label>
        <textarea
          name="backstory"
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none resize-none"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400 block mb-1">Заметки</label>
        <textarea
          name="notes"
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none resize-none"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-2.5 rounded-lg font-semibold transition"
      >
        {loading ? "Сохранение..." : "Создать персонажа"}
      </button>
    </form>
  )
}
