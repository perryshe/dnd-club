"use client"

import { Trash2 } from "lucide-react"
import { deleteUser } from "./actions"

export function DeleteButton({ userId }: { userId: string }) {
  return (
    <form
      action={async () => {
        if (confirm("Удалить пользователя?")) {
          await deleteUser(userId)
        }
      }}
    >
      <button className="flex items-center gap-1 text-xs px-2 py-1 bg-red-800 hover:bg-red-700 rounded transition">
        <Trash2 size={12} />
        Удалить
      </button>
    </form>
  )
}
