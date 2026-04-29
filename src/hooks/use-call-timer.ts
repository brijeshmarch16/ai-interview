import { useEffect, useRef, useState } from "react"

const TIMER_TICK_MS = 10
const TICKS_PER_SECOND = 100 // 1000ms / TIMER_TICK_MS
const SECONDS_PER_MINUTE = 60

export function useCallTimer(
  maxDurationMinutes: string,
  isCalling: boolean,
  onTimeUp: () => void
) {
  const [elapsedMs, setElapsedMs] = useState(0)
  const elapsedMsRef = useRef(0)
  const onTimeUpRef = useRef(onTimeUp)
  const timeUpFiredRef = useRef(false)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    if (!isCalling) return

    const intervalId: ReturnType<typeof setInterval> = setInterval(() => {
      elapsedMsRef.current += 1
      setElapsedMs(elapsedMsRef.current)
    }, TIMER_TICK_MS)

    return () => clearInterval(intervalId)
  }, [isCalling])

  const elapsedSeconds = Math.floor(elapsedMs / TICKS_PER_SECOND)
  const totalSeconds = Number(maxDurationMinutes) * SECONDS_PER_MINUTE
  const progressPercent =
    totalSeconds > 0 ? (elapsedSeconds / totalSeconds) * 100 : 0

  useEffect(() => {
    if (
      isCalling &&
      totalSeconds > 0 &&
      elapsedSeconds >= totalSeconds &&
      !timeUpFiredRef.current
    ) {
      timeUpFiredRef.current = true
      onTimeUpRef.current()
    }
  }, [elapsedSeconds, isCalling, totalSeconds])

  return { elapsedSeconds, progressPercent }
}
