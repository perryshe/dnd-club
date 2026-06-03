"use client"

import CharacterForm from "@/components/character-form"

export default function CreateCharacterForm() {
  return (
    <CharacterForm
      slug="dead-band"
      inputClass="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
      focusClass="focus:border-red-500"
      btnClass="bg-red-600"
      btnHoverClass="hover:bg-red-700"
    />
  )
}
