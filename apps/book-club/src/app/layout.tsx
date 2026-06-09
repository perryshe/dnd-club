import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import Image from "next/image"
import Link from "next/link"
import SignOutButton from "@/components/signout-button"
import GameModal from "@/components/GameModal"
import { Cpu } from "lucide-react"

const basePath = "/b21"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "b21 Club — Книжный клуб",
    description: "Книжный клуб d21 Club",
  }
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
        <link rel="icon" href={`${basePath}/d21-logo.jpg`} type="image/jpeg" />
        <SessionProvider session={session}>
          <nav className="bg-black border-b border-slate-800">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <a href={process.env.NEXT_PUBLIC_DND_CLUB_URL} className="flex items-center gap-2 font-bold text-amber-400 hover:text-amber-300 transition">
                  <Image src={`${basePath}/d21-logo.jpg`} alt="" width={24} height={24} className="w-6 h-6 rounded" unoptimized />
                  d21 Club
                </a>
                <Link href="/book-club" className="flex items-center gap-2 font-bold text-cyan-400">
                  <Image src={`${basePath}/club-logo.svg`} alt="" width={24} height={24} className="w-6 h-6" unoptimized />
                  b21 Club
                </Link>
                <GameModal url={process.env.NEXT_PUBLIC_T21_GAME_URL ?? ""} />
              </div>
              <div className="flex items-center gap-4 text-sm">
                {session?.user ? (
                  <>
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
                      className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-lg transition"
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
          <div className="border-b border-slate-800/40 bg-slate-950/50">
            <div className="container mx-auto px-4 h-8 flex items-center gap-2 text-slate-600">
              <Cpu size={12} />
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase">v.{Math.ceil(Math.random() * 9)}.{Math.floor(Math.random() * 20)} — T21 Network</span>
              <span className="text-[8px] text-slate-700 ml-auto font-mono">system online</span>
            </div>
          </div>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
