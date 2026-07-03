"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { ClubHeader } from "club-nav"
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

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace("#", "")
      if (["collection", "vote", "wish"].includes(hash)) setTab(hash)
    }
    window.addEventListener("hashchange", onHash)
    onHash()
    return () => window.removeEventListener("hashchange", onHash)
  }, [])
  const [games, setGames] = useState<Game[]>([])
  const [votes, setVotes] = useState<VoteCounts>({})
  const [wishes, setWishes] = useState<WishEntry[]>([])
  const [meetings, setMeetings] = useState<MeetingData[]>([])
  const [loading, setLoading] = useState(true)

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "sadmin"
  const nextMeeting = meetings.filter(m => new Date(m.date) > new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

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
    if (!nextMeeting) return
    await fetch("/g21/api/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, meetingId: nextMeeting.id }),
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

      <ClubHeader
        club="g21"
        rightContent={
          loading ? (
            <div className="text-xs font-mono text-slate-600 animate-pulse">// loading ...</div>
          ) : nextMeeting ? (
            <div className="rounded-lg border border-cyan-900/30 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400/60">
                  Ближайшая встреча
                </span>
              </div>
              <div className="text-lg font-semibold text-cyan-200">
                {new Date(nextMeeting.date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                {nextMeeting.games.length} {nextMeeting.games.length === 1 ? "игра" : "игр"}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-700/30 bg-slate-900/60 p-4">
              <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
                <span className="text-cyan-500/60">{games.length}</span> игр
                <span className="mx-2">·</span>
                <span className="text-cyan-500/60">{meetings.length}</span> встреч
                <span className="mx-2">·</span>
                <span className="text-cyan-500/60">{wishes.length}</span> в вишлисте
              </div>
            </div>
          )
        }
      />

      <section className="relative">
        <div className="container mx-auto px-4 pb-16 text-center">

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
                    nextMeeting={nextMeeting}
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
