"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Cpu, ScanLine, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const res = await signIn("credentials", {
      schoolNick: form.get("schoolNick") as string,
      password: form.get("password") as string,
      redirect: false,
    })

    if (res?.error) {
      setError("Неверный ник или пароль, либо аккаунт ещё не подтверждён")
      setLoading(false)
    } else {
      router.push("/book-club")
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 scanlines">
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,.2) 1px,transparent 1px),
            linear-gradient(90deg,rgba(34,211,238,.2) 1px,transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400/80 text-[10px] font-mono tracking-[0.25em] uppercase mb-6">
            <Sparkles size={12} />
            Book Club
            <Sparkles size={12} />
          </div>
          <h1 className="text-3xl font-black mb-2">
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Войти
            </span>
          </h1>
          <p className="text-slate-500 text-xs font-mono">чтение — это диалог</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500">Школьный ник или email</label>
            <input
              name="schoolNick"
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/50 text-sm text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition"
              placeholder="никнейм"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500">Пароль</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/50 text-sm text-white font-mono placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-sm font-mono tracking-wider uppercase font-semibold transition shadow-lg shadow-cyan-900/30 disabled:opacity-50"
          >
            <ScanLine size={14} className="inline mr-2" />
            {loading ? "Вход..." : "Войти"}
          </button>

          <p className="text-center text-[10px] font-mono text-slate-600">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition">
              Зарегистрироваться
            </Link>
          </p>
        </form>

        <div className="flex items-center gap-2 justify-center mt-8">
          <Cpu size={12} className="text-slate-700" />
          <span className="text-[10px] font-mono text-slate-700">b21 Club // login</span>
        </div>
      </div>
    </main>
  )
}
