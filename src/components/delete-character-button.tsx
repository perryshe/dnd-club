"use client"

import { Trash2 } from "lucide-react"
import { deleteCharacter } from "@/lib/character-actions"

export default function DeleteCharacterButton({
  characterId,
}: {
  characterId: string
}) {
  return (
    <form
      action={async () => {
        if (confirm("Удалить персонажа?")) {
          await deleteCharacter(characterId)
        }
      }}
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
    >
      <button className="p-1.5 bg-red-900/80 hover:bg-red-700 rounded-lg transition">
        <Trash2 size={16} />
      </button>
    </form>
  )
}
