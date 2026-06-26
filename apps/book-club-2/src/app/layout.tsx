import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "b22 Club — Book Club",
  description: "Book club v2",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="ru">
      <body className="antialiased">
        <link rel="icon" href="/b22/club-logo.svg" type="image/svg+xml" />
        <SessionProvider session={session}>
          <nav className="bg-black border-b border-slate-800">
            <div className="container mx-auto px-4 h-12 flex items-center gap-6">
              <a href={process.env.NEXT_PUBLIC_DND_CLUB_URL} className="flex items-center gap-2 font-bold text-amber-400 hover:text-amber-300 transition">
                <Image src="/club-logo.svg" alt="" width={24} height={24} className="w-6 h-6 rounded" unoptimized />
                d21 Club
              </a>
              <Link href="/" className="flex items-center gap-2 font-bold text-cyan-400">
                <Image src="/club-logo.svg" alt="" width={24} height={24} className="w-6 h-6" unoptimized />
                b22 Club
              </Link>
              <a href={process.env.NEXT_PUBLIC_DND_CLUB_URL + "/t21/"} className="flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300 transition">
                t21 Club
              </a>
              <a href={process.env.NEXT_PUBLIC_DND_CLUB_URL + "/e21/"} className="flex items-center gap-2 font-bold text-green-400 hover:text-green-300 transition">
                e21 Club
              </a>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
            <div className="container mx-auto px-4 h-10 flex items-center justify-end gap-4">
              {session?.user ? (
                <>
                  <span className="text-sm text-slate-500">{session.user.name}</span>
                  <a href={process.env.NEXT_PUBLIC_DND_CLUB_URL + "/api/auth/signout"} className="text-sm text-slate-400 hover:text-white transition">Выйти</a>
                </>
              ) : (
                <a href={process.env.NEXT_PUBLIC_DND_CLUB_URL + "/login"} className="text-sm text-slate-400 hover:text-white transition">Войти</a>
              )}
            </div>
          </nav>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
