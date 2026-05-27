import { useCallback, useState } from 'react'

export type TimeFormat = '12' | '24'

export const DEFAULT_TIME_FORMAT: TimeFormat = '24'
export const FORMAT_PREFERENCE_STORAGE_KEY = 'clock-format-preference'

function isTimeFormat(value: string | null): value is TimeFormat {
  return value === '12' || value === '24'
}

function getStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readStoredFormatPreference(): TimeFormat {
  const storage = getStorage()

  if (!storage) {
    return DEFAULT_TIME_FORMAT
  }

  try {
    const storedFormat = storage.getItem(FORMAT_PREFERENCE_STORAGE_KEY)
    return isTimeFormat(storedFormat) ? storedFormat : DEFAULT_TIME_FORMAT
  } catch {
    return DEFAULT_TIME_FORMAT
  }
}

function writeStoredFormatPreference(format: TimeFormat): void {
  const storage = getStorage()

  if (!storage) {
    return
  }

  try {
    storage.setItem(FORMAT_PREFERENCE_STORAGE_KEY, format)
  } catch {
    // Storage can be disabled or quota-limited. The in-memory state still updates.
  }
}

export function useFormatPreference(): [
  TimeFormat,
  (format: TimeFormat) => void,
] {
  const [formatPreference, setFormatPreferenceState] = useState(
    readStoredFormatPreference,
  )

  const setFormatPreference = useCallback((format: TimeFormat) => {
    setFormatPreferenceState(format)
    writeStoredFormatPreference(format)
  }, [])

  return [formatPreference, setFormatPreference]
}
