import { useFormatPreference } from '../hooks/useFormatPreference'
import type { TimeFormat } from '../types/time'

export interface FormatToggleProps {
  value?: TimeFormat
  onChange?: (format: TimeFormat) => void
}

const optionBaseClass =
  'flex h-8 min-w-12 items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors'
const activeOptionClass =
  'bg-slate-950 text-white shadow-sm dark:bg-slate-50 dark:text-slate-950'
const inactiveOptionClass = 'text-slate-500 dark:text-slate-400'

export function FormatToggle({ value, onChange }: FormatToggleProps) {
  const [storedFormat, setStoredFormat] = useFormatPreference()
  const currentFormat = value ?? storedFormat
  const isTwentyFourHour = currentFormat === '24'

  const handleToggle = () => {
    const nextFormat: TimeFormat = isTwentyFourHour ? '12' : '24'

    if (onChange) {
      onChange(nextFormat)
      return
    }

    setStoredFormat(nextFormat)
  }

  return (
    <button
      aria-checked={isTwentyFourHour}
      aria-label="Use 24-hour time"
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/85 p-1 shadow-sm shadow-slate-200/80 transition-colors hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-black/20 dark:hover:border-slate-700 dark:focus-visible:ring-slate-50 dark:focus-visible:ring-offset-slate-950"
      onClick={handleToggle}
      role="switch"
      type="button"
    >
      <span
        className={`${optionBaseClass} ${
          isTwentyFourHour ? inactiveOptionClass : activeOptionClass
        }`}
      >
        12h
      </span>
      <span
        className={`${optionBaseClass} ${
          isTwentyFourHour ? activeOptionClass : inactiveOptionClass
        }`}
      >
        24h
      </span>
    </button>
  )
}
