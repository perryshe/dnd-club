import CharacterSheet from "@/components/character-sheet"

export default function Page({ params }: { params: { id: string } }) {
  return <CharacterSheet characterId={params.id} accentColor="red-500" accentBorder="border-red-500/30" />
}
