import { useClock } from '../hooks/useClock'
import { formatTime } from '../lib/formatters'
import type { TimeFormat } from '../types/time'

export interface ClockDisplayProps {
  mode: TimeFormat
}

export function ClockDisplay({ mode }: ClockDisplayProps) {
  const currentTime = useClock()
  const displayTime = formatTime(currentTime, mode)

  return (
    <time
      aria-label="Current time"
      className="block text-center font-mono text-5xl leading-none font-semibold tracking-normal text-slate-950 tabular-nums sm:text-7xl md:text-8xl dark:text-slate-50"
      dateTime={currentTime.toISOString()}
    >
      {displayTime}
    </time>
  )
}
