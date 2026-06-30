import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import "./globals.css"
import { Sidebar } from "@/components/Sidebar"
import ClubNav, { ClubHeader } from "club-nav"
import { Cpu } from "lucide-react"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "English for Manager — Course",
  description: "15 дней · 22 июн – 10 июл 2026",
  icons: {
    icon: "/favicon.svg",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="ru" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
        <SessionProvider session={session}>
          <ClubNav
            active="e21"
            dndClubUrl={process.env.NEXT_PUBLIC_DND_CLUB_URL ?? "/"}
            bookClubUrl={process.env.NEXT_PUBLIC_BOOK_CLUB_URL}
            activeHref="/e21/"
            session={session}
            t21Url={(process.env.NEXT_PUBLIC_DND_CLUB_URL ?? "/") + "t21/"}
          />
          <ClubHeader club="e21" />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
          <footer className="border-t border-slate-800/40 bg-slate-950/50">
            <div className="container mx-auto px-4 h-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Cpu size={12} />
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase">v.2.0 — e21 network</span>
                <span className="text-[8px] text-slate-700 font-mono">system online</span>
              </div>
              <div className="flex items-center gap-4">
                {session?.user ? (
                  <>
                    <span className="text-sm text-slate-500">{session.user.name}</span>
                    <a
                      href={(process.env.NEXT_PUBLIC_DND_CLUB_URL ?? "/") + "api/auth/signout"}
                      className="text-sm text-slate-400 hover:text-white transition"
                    >
                      Выйти
                    </a>
                  </>
                ) : (
                  <a
                    href={(process.env.NEXT_PUBLIC_DND_CLUB_URL ?? "/") + "login"}
                    className="text-sm text-slate-400 hover:text-white transition"
                  >
                    Войти
                  </a>
                )}
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}
