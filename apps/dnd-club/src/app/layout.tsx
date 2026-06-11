import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import Link from "next/link"
import SignOutButton from "@/components/signout-button"

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
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-amber-400">
                  <img src="/favicon21.jpg" alt="" className="w-6 h-6 rounded" />
                  d21 Club
                </Link>
                <a href={process.env.NEXT_PUBLIC_BOOK_CLUB_URL} className="flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300 transition">
                  <img src="/book-favicon.svg" alt="" className="w-6 h-6" />
                  b21 Club
                </a>
                <a href={process.env.NEXT_PUBLIC_T21_GAME_URL ?? "/t21/"} className="flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300 transition">
                  <span className="w-4 h-4 rounded flex items-center justify-center bg-indigo-600 text-white text-[8px] font-bold">#</span>
                  <span className="text-xs">t21 Club</span>
                </a>
              </div>
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
                    <Link href="/profile" className="text-slate-300 hover:text-white transition">Профиль</Link>
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
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
