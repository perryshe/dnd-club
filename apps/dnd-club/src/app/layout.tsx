import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import Link from "next/link"
import SignOutButton from "@/components/signout-button"
import GameModal from "@/components/GameModal"

export const metadata: Metadata = {
  title: "d21 Club",
  description: "Настольные ролевые игры",
  icons: "/favicon21.jpg",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="ru">
      <body className="antialiased">
        <SessionProvider session={session}>
          <nav className="bg-black border-b border-slate-800">
            <div className="container mx-auto px-4 h-12 flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 font-bold text-amber-400">
                <img src="/favicon21.jpg" alt="" className="w-6 h-6 rounded" />
                d21 Club
              </Link>
              <a href={process.env.NEXT_PUBLIC_BOOK_CLUB_URL} className="flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300 transition">
                <img src="/book-favicon.svg" alt="" className="w-5 h-5" />
                b21 Club
              </a>
              <a href="/b22/" className="flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300 transition">
                <img src="/book-favicon.svg" alt="" className="w-5 h-5" />
                b22 Club
              </a>
              <GameModal url={process.env.NEXT_PUBLIC_T21_GAME_URL ?? ""} />
              <a href="/e21/" className="flex items-center gap-2 font-bold text-green-400 hover:text-green-300 transition">
                e21 Club
              </a>
              {session?.user?.role === "sadmin" && (
                <a href="/quest/" className="flex items-center gap-2 font-bold text-purple-400 hover:text-purple-300 transition">
                  quest
                </a>
              )}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
            <div className="container mx-auto px-4 h-10 flex items-center justify-end gap-4">
              {session?.user ? (
                <>
                  {(session.user.role === "admin" || session.user.role === "sadmin") && (
                    <Link href="/admin" className="text-sm text-slate-400 hover:text-white transition">Админ</Link>
                  )}
                  <Link href="/profile" className="text-sm text-slate-400 hover:text-white transition">Профиль</Link>
                  <span className="text-sm text-slate-500">{session.user.name}</span>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-slate-400 hover:text-white transition">Войти</Link>
                  <Link href="/register" className="bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg text-white text-sm transition">Регистрация</Link>
                </>
              )}
            </div>
          </nav>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
