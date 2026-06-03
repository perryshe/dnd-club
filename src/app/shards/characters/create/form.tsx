"use client"

import CharacterForm from "@/components/character-form"

export default function CreateCharacterForm() {
  return (
    <CharacterForm
      slug="shards"
      inputClass="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-purple-500 outline-none"
      btnClass="bg-purple-600"
      btnHoverClass="hover:bg-purple-700"
    />
  )
}
