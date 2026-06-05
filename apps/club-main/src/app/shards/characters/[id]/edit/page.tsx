import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import CharacterForm from "@/components/character-form"

export default async function EditCharacterPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const character = await prisma.character.findUnique({
    where: { id: params.id },
    include: { campaign: true },
  })
  if (!character) notFound()

  const isOwner = character.userId === session.user.id
  const isAdmin = session.user.role === "admin"
  if (!isOwner && !isAdmin) redirect(`/${character.campaign.slug}`)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <Link
          href={`/${character.campaign.slug}/characters/${character.id}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          К персонажу
        </Link>
        <h1 className="text-3xl font-bold">Редактирование персонажа</h1>
        <p className="text-slate-400 mt-1">{character.name}</p>
      </header>

      <main className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl">
          <CharacterForm
            slug={character.campaign.slug}
            character={character}
            inputClass="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-purple-500 outline-none"
            btnClass="bg-purple-600"
            btnHoverClass="hover:bg-purple-700"
          />
        </div>
      </main>
    </div>
  )
}
