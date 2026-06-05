"use client"

import { useEffect, useState } from "react"

function calcDiff(target: Date) {
  const now = Date.now()
  const diff = target.getTime() - now
  if (diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

export default function Countdown({ target }: { target: Date }) {
  const [diff, setDiff] = useState(calcDiff(target))

  useEffect(() => {
    const id = setInterval(() => setDiff(calcDiff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!diff) return null

  return (
    <span className="text-[10px] font-mono tracking-wider text-cyan-400/70">
      <span className="text-cyan-500/40">[</span>
      {diff.days > 0 && <>{diff.days}д </>}
      {String(diff.hours).padStart(2, "0")}ч {String(diff.minutes).padStart(2, "0")}м {String(diff.seconds).padStart(2, "0")}с
      <span className="text-cyan-500/40">]</span>
    </span>
  )
}
