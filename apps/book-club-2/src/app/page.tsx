import type { Metadata } from "next"
import { ClubHeader } from "club-nav"
import StatsCards from "@/components/StatsCards"
import VoteSection from "@/components/VoteSection"
import BookGrid from "@/components/BookGrid"
import RatingTable from "@/components/RatingTable"
import SuggestModal from "@/components/SuggestModal"
import ReadingLog from "@/components/ReadingLog"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "b21 Club — Book Club",
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

      <ClubHeader club="b21" />

      <section className="relative">
        <div className="container mx-auto px-4 pb-16 text-center">
          <StatsCards />
        </div>
      </section>

      <ReadingLog />

      {/* Content */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
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
              d21 // b21 club
            </span>
            <div className="w-px h-3 bg-cyan-500/30" />
          </div>
        </div>
      </footer>

      <SuggestModal />
    </main>
  )
}
