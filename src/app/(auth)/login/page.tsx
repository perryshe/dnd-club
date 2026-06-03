"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)

    const csrfRes = await fetch("/api/auth/csrf")
    const { csrfToken } = await csrfRes.json()

    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken,
        email: form.get("email") as string,
        password: form.get("password") as string,
      }),
    })

    if (res.ok || res.redirected) {
      router.push("/")
      router.refresh()
    } else {
      setError("Неверный email или пароль, либо аккаунт ещё не подтверждён")
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">Вход</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-slate-400 block mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-amber-500 outline-none"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">Пароль</label>
          <input
            name="password"
            type="password"
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-amber-500 outline-none"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 py-2 rounded-lg font-semibold transition"
        >
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>

      <p className="text-center text-slate-400 text-sm mt-4">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-amber-400 hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  )
}
