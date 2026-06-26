import type { Metadata } from "next"
import { Sparkles } from "lucide-react"
import StatsCards from "@/components/StatsCards"
import BookOfMonth from "@/components/BookOfMonth"
import VoteSection from "@/components/VoteSection"
import BookGrid from "@/components/BookGrid"
import RatingTable from "@/components/RatingTable"
import SuggestModal from "@/components/SuggestModal"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "b22 Club — Book Club",
  description: "Book club v2",
}

export default async function HomePage({ searchParams }: { searchParams?: { sort?: string } }) {
  return (
    <main className="min-h-screen text-slate-300 bg-slate-950 scanlines selection:bg-cyan-500/20 selection:text-cyan-200">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      {/* Hero */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400/80 text-[10px] font-mono tracking-[0.25em] uppercase mb-12">
            <Sparkles size={12} />
            Module // reading division v.2
            <Sparkles size={12} />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Книжный
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 bg-clip-text text-transparent">
              клуб
            </span>
          </h1>

          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed font-mono mb-12">
            <span className="text-cyan-500/60">[</span> community reading & reviews <span className="text-cyan-500/60">]</span>
          </p>

          <StatsCards />
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
              <span className="text-slate-600 font-mono text-[10px] tracking-[0.3em] uppercase">// reading log</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
            </div>

            <BookOfMonth />
            <VoteSection />
            <BookGrid />
            <RatingTable searchParams={searchParams} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/60">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-px h-3 bg-cyan-500/30" />
            <span className="text-slate-600 text-[10px] font-mono tracking-[0.3em] uppercase">
              d21 // b22 club
            </span>
            <div className="w-px h-3 bg-cyan-500/30" />
          </div>
        </div>
      </footer>

      <SuggestModal />
    </main>
  )
}
