import type { TimeFormat } from '../types/time'

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function padTimePart(value: number): string {
  return value.toString().padStart(2, '0')
}

export function formatTime(date: Date, mode: TimeFormat): string {
  const hours = date.getHours()
  const minutes = padTimePart(date.getMinutes())
  const seconds = padTimePart(date.getSeconds())

  if (mode === '24') {
    return `${padTimePart(hours)}:${minutes}:${seconds}`
  }

  const period = hours >= 12 ? 'PM' : 'AM'
  const twelveHour = hours % 12 || 12

  return `${padTimePart(twelveHour)}:${minutes}:${seconds} ${period}`
}

export function formatDate(date: Date): string {
  return DATE_FORMATTER.format(date)
}
