"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import SignOutButton from "@/components/signout-button"

export default function Nav() {
  const { data: session } = useSession()

  return (
    <nav className="bg-slate-900/80 border-b border-slate-700">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-amber-400">
          ДНД Клуб
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {session?.user ? (
            <>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-slate-300 hover:text-white transition"
                >
                  Админ
                </Link>
              )}
              <span className="text-slate-400">{session.user.name}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg transition"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
