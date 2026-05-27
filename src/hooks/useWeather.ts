import { useEffect, useState } from 'react'

import { fetchWeatherForCity, type WeatherData } from '../lib/weatherApi'

const WEATHER_CACHE_TTL_MS = 15 * 60 * 1000

interface CacheEntry {
  data: WeatherData
  timestamp: number
}

export interface WeatherState {
  data: WeatherData | null
  error: string | null
  loading: boolean
}

const weatherCache = new Map<string, CacheEntry>()

function normalizeCacheKey(city: string): string {
  return city.trim().toLocaleLowerCase()
}

function readCachedWeather(city: string, now: number): WeatherData | null {
  const cacheEntry = weatherCache.get(normalizeCacheKey(city))

  if (!cacheEntry) {
    return null
  }

  if (now - cacheEntry.timestamp > WEATHER_CACHE_TTL_MS) {
    weatherCache.delete(normalizeCacheKey(city))
    return null
  }

  return cacheEntry.data
}

function writeCachedWeather(city: string, data: WeatherData): void {
  weatherCache.set(normalizeCacheKey(city), {
    data,
    timestamp: Date.now(),
  })
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load weather'
}

export function clearWeatherCacheForTests(): void {
  weatherCache.clear()
}

export function useWeather(city: string): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    error: null,
    loading: false,
  })

  useEffect(() => {
    let isActive = true
    const setActiveState = (nextState: WeatherState): void => {
      queueMicrotask(() => {
        if (isActive) {
          setState(nextState)
        }
      })
    }
    const setLoadingState = (): void => {
      queueMicrotask(() => {
        if (isActive) {
          setState((currentState) => ({
            data: currentState.data,
            error: null,
            loading: true,
          }))
        }
      })
    }
    const trimmedCity = city.trim()

    if (!trimmedCity) {
      setActiveState({
        data: null,
        error: 'City name is required',
        loading: false,
      })
      return () => {
        isActive = false
      }
    }

    const cachedWeather = readCachedWeather(trimmedCity, Date.now())

    if (cachedWeather) {
      setActiveState({
        data: cachedWeather,
        error: null,
        loading: false,
      })
      return () => {
        isActive = false
      }
    }

    setLoadingState()

    fetchWeatherForCity(trimmedCity)
      .then((weather) => {
        writeCachedWeather(trimmedCity, weather)

        if (isActive) {
          setState({
            data: weather,
            error: null,
            loading: false,
          })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            data: null,
            error: getErrorMessage(error),
            loading: false,
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [city])

  return state
}
