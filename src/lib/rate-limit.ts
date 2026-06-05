const attempts = new Map<string, number[]>()

const WINDOW_MS = 60 * 60 * 1000
const MAX_ATTEMPTS = 3

export function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const timestamps = attempts.get(key) ?? []
  const recent = timestamps.filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_ATTEMPTS) return false

  recent.push(now)
  attempts.set(key, recent)
  return true
}
