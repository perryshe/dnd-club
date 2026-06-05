import CharacterSheet from "@/components/character-sheet"

export default function Page({ params }: { params: { id: string } }) {
  return <CharacterSheet characterId={params.id} accentColor="purple-500" accentBorder="border-purple-500/30" />
}
