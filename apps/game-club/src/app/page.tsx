"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { Sparkles, MessageCircle } from "lucide-react"
import Collection from "@/components/collection"
import VoteSection from "@/components/vote-section"
import Wishlist from "@/components/wishlist"
import Meetings from "@/components/meetings"

type Game = {
  id: string
  name: string
  time: string | null
  players: string | null
  age: string | null
  year: number | null
  isExp: boolean
  image: string | null
}

type VoteCounts = Record<string, { up: number; down: number }>
type WishEntry = { id: string; gameId: string; game: Game }
type MeetingData = {
  id: string
  date: string
  allGames: boolean
  games: { game: Game }[]
}

export default function HomePage() {
  const { data: session } = useSession()
  const [tab, setTab] = useState("main")
  const [games, setGames] = useState<Game[]>([])
  const [votes, setVotes] = useState<VoteCounts>({})
  const [wishes, setWishes] = useState<WishEntry[]>([])
  const [meetings, setMeetings] = useState<MeetingData[]>([])
  const [loading, setLoading] = useState(true)

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "sadmin"

  const fetchAll = useCallback(async () => {
    const [g, v, w, m] = await Promise.all([
      fetch("/g21/api/games").then(r => r.json()),
      fetch("/g21/api/votes").then(r => r.json()),
      fetch("/g21/api/wishes").then(r => r.json()),
      fetch("/g21/api/meetings").then(r => r.json()),
    ])
    setGames(g)
    setVotes(v)
    setWishes(w)
    setMeetings(m)
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function toggleVote(gameId: string, direction: "up" | "down") {
    await fetch("/g21/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, direction }),
    })
    fetchAll()
  }

  async function toggleWish(gameId: string) {
    await fetch("/g21/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    })
    fetchAll()
  }

  async function saveGame(data: Partial<Game> & { id?: string }) {
    const url = data.id ? `/g21/api/games/${data.id}` : "/g21/api/games"
    await fetch(url, {
      method: data.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    fetchAll()
  }

  async function deleteGame(id: string) {
    await fetch(`/g21/api/games/${id}`, { method: "DELETE" })
    fetchAll()
  }

  async function createMeeting(date: string, allGames: boolean, gameIds: string[]) {
    await fetch("/g21/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, allGames, gameIds }),
    })
    fetchAll()
  }

  const tabs = [
    { key: "main", label: "🏠 Главная" },
    { key: "collection", label: "🎲 Коллекция" },
    { key: "vote", label: "🏆 Голосование" },
    { key: "wish", label: "💝 Вишлист" },
  ]

  return (
    <main className="min-h-screen text-slate-300 bg-slate-950 scanlines selection:bg-cyan-500/20 selection:text-cyan-200">
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(34,211,238,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.2) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <section className="relative">
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400/80 text-[10px] font-mono tracking-[0.25em] uppercase mb-12">
            <Sparkles size={12} />
            Module // board games division
            <Sparkles size={12} />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              g21
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent">
              Club
            </span>
          </h1>

          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed font-mono mb-8">
            <span className="text-cyan-500/60">[</span> collection & voting & meetings <span className="text-cyan-500/60">]</span>
          </p>

          <a
            href="https://t.me/tagort"
            target="_blank"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 px-6 py-3 rounded-lg transition shadow-lg shadow-cyan-900/30 text-sm font-mono tracking-wider uppercase mb-12"
          >
            <MessageCircle size={18} />
            Telegram
          </a>

          {!loading && (
            <div className="flex items-center justify-center gap-1 text-xs font-mono text-slate-600 mb-8">
              <span className="text-cyan-500/60">{games.length}</span> игр
              <span className="mx-2">·</span>
              <span className="text-cyan-500/60">{meetings.length}</span> встреч
              <span className="mx-2">·</span>
              <span className="text-cyan-500/60">{wishes.length}</span> в вишлисте
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition font-semibold ${
                  tab === t.key
                    ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-500 border border-slate-700/30 hover:border-slate-600/50 hover:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-20 text-slate-600 font-mono text-sm">// loading ...</div>
            ) : (
              <>
                {tab === "main" && (
                  <Meetings
                    meetings={meetings}
                    games={games}
                    isAdmin={isAdmin}
                    onCreateMeeting={createMeeting}
                  />
                )}
                {tab === "collection" && (
                  <Collection
                    games={games}
                    votes={votes}
                    wishes={wishes}
                    sessionUserId={session?.user?.id}
                    isAdmin={isAdmin}
                    onVote={toggleVote}
                    onWish={toggleWish}
                    onSave={saveGame}
                    onDelete={deleteGame}
                  />
                )}
                {tab === "vote" && (
                  <VoteSection
                    games={games}
                    votes={votes}
                    sessionUserId={session?.user?.id}
                    onVote={toggleVote}
                  />
                )}
                {tab === "wish" && (
                  <Wishlist
                    wishes={wishes}
                    onRemove={toggleWish}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
