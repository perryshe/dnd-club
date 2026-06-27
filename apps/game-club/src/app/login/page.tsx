"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const form = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      schoolNick: form.get("schoolNick"),
      password: form.get("password"),
      redirect: false,
    })
    if (result?.error) {
      setError("Неверный ник или пароль")
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 scanlines">
      <div className="w-full max-w-sm mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              g21
            </span>
            <span className="text-slate-300"> Club</span>
          </h1>
          <p className="text-slate-600 text-sm font-mono">board games · вход</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1 tracking-wider uppercase">Ник или email</label>
            <input
              name="schoolNick"
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono outline-none focus:border-cyan-500/50 transition"
              placeholder="school_nick или email"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1 tracking-wider uppercase">Пароль</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm font-mono outline-none focus:border-cyan-500/50 transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white text-sm font-mono tracking-wider uppercase font-semibold transition shadow-lg shadow-cyan-900/30"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}
