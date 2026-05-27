import { useCallback, useState } from 'react'

export const DEFAULT_CITY = 'London'
export const CITY_PREFERENCE_STORAGE_KEY = 'weather-city-preference'

function normalizeCityName(city: string): string {
  return city.trim()
}

function getStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function readStoredCityPreference(): string {
  const storage = getStorage()

  if (!storage) {
    return DEFAULT_CITY
  }

  try {
    const storedCity = storage.getItem(CITY_PREFERENCE_STORAGE_KEY)
    const normalizedCity = storedCity ? normalizeCityName(storedCity) : ''
    return normalizedCity || DEFAULT_CITY
  } catch {
    return DEFAULT_CITY
  }
}

function writeStoredCityPreference(city: string): void {
  const storage = getStorage()

  if (!storage) {
    return
  }

  try {
    storage.setItem(CITY_PREFERENCE_STORAGE_KEY, city)
  } catch {
    // Storage can be disabled or quota-limited. The in-memory state still updates.
  }
}

export function useCityPreference(): [string, (city: string) => void] {
  const [cityPreference, setCityPreferenceState] = useState(
    readStoredCityPreference,
  )

  const setCityPreference = useCallback((city: string) => {
    const normalizedCity = normalizeCityName(city) || DEFAULT_CITY
    setCityPreferenceState(normalizedCity)
    writeStoredCityPreference(normalizedCity)
  }, [])

  return [cityPreference, setCityPreference]
}
