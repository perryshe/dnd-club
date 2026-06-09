import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import CreateCharacterForm from "./form"

export default async function CreateCharacterPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <Link
          href="/shards"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          К персонажам
        </Link>
        <h1 className="text-3xl font-bold">Создание персонажа</h1>
        <p className="text-slate-400 mt-1">Shards of Night City</p>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl">
          <CreateCharacterForm />
        </div>
      </main>
    </div>
  )
}
