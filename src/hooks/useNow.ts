import { useEffect, useState } from 'react'

/** Ticks every `intervalMs` so components can show a live clock/countdown. */
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
