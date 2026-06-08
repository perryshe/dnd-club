"use client"

import { useState } from "react"

export default function GameModal({ url }: { url: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300 transition bg-transparent border-none cursor-pointer">
        <span className="w-4 h-4 rounded flex items-center justify-center bg-indigo-600 text-white text-[8px] font-bold">t</span>
        <span className="text-xs">t21 Club</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-start bg-black/70"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-[360px] h-[480px] mt-16 ml-4 bg-[#1a1a2e] rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 z-10 w-5 h-5 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full text-xs leading-none"
            >
              &times;
            </button>
            <iframe
              src={url}
              className="w-full h-full border-none"
              title="t21 Club"
            />
          </div>
        </div>
      )}
    </>
  )
}
