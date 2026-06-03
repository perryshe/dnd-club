"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        name: form.get("name"),
        password: form.get("password"),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
    } else {
      setMessage(data.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
      <h1 className="text-2xl font-bold mb-6 text-white text-center">
        Регистрация
      </h1>

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
          <label className="text-sm text-slate-400 block mb-1">Имя</label>
          <input
            name="name"
            type="text"
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
            minLength={6}
            className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-amber-500 outline-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 py-2 rounded-lg font-semibold transition"
        >
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>

      <p className="text-center text-slate-400 text-sm mt-4">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-amber-400 hover:underline">
          Войти
        </Link>
      </p>
    </div>
  )
}
