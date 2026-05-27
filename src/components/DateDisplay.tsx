import { useClock } from '../hooks/useClock'
import { formatDate } from '../lib/formatters'

function padDatePart(value: number): string {
  return value.toString().padStart(2, '0')
}

function formatDateTimeValue(date: Date): string {
  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())

  return `${year}-${month}-${day}`
}

export function DateDisplay() {
  const currentDate = useClock()

  return (
    <time
      aria-label="Current date"
      className="block text-center text-lg font-medium tracking-normal text-slate-600 sm:text-xl dark:text-slate-300"
      dateTime={formatDateTimeValue(currentDate)}
    >
      {formatDate(currentDate)}
    </time>
  )
}
