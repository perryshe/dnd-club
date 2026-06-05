"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { changePassword } from "@/lib/admin-actions"

export default function PasswordChangeForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      await changePassword(new FormData(e.currentTarget))
      setMessage({ ok: true, text: "Пароль изменён" })
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Ошибка" })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="text-xs text-slate-400 block mb-1">Текущий пароль</label>
        <input name="current" type="password" required className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm" />
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Новый пароль</label>
        <input name="new" type="password" required minLength={6} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm" />
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Подтвердите новый пароль</label>
        <input name="confirm" type="password" required minLength={6} className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm" />
      </div>
      {message && (
        <p className={`text-sm ${message.ok ? "text-green-400" : "text-red-400"}`}>{message.text}</p>
      )}
      <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 px-4 py-2 rounded-lg text-sm transition">
        {loading ? "Сохранение..." : "Сменить пароль"}
      </button>
    </form>
  )
}
