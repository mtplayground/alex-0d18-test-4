import { useEffect, useState, type FormEvent } from 'react'

import type { WeatherData } from '../lib/weatherApi'

interface WeatherCondition {
  icon: string
  label: string
}

export interface WeatherPanelProps {
  city: string
  error?: string | null
  loading?: boolean
  onCityChange: (city: string) => void
  weather: WeatherData | null
}

function getWeatherCondition(weatherCode: number): WeatherCondition {
  if (weatherCode === 0) {
    return { icon: '☀', label: 'Clear sky' }
  }

  if ([1, 2, 3].includes(weatherCode)) {
    return { icon: '◐', label: 'Partly cloudy' }
  }

  if ([45, 48].includes(weatherCode)) {
    return { icon: '≋', label: 'Fog' }
  }

  if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) {
    return { icon: '☂', label: 'Rain' }
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return { icon: '✳', label: 'Snow' }
  }

  if (weatherCode >= 95 && weatherCode <= 99) {
    return { icon: '⚡', label: 'Thunderstorm' }
  }

  return { icon: '○', label: 'Weather conditions' }
}

function formatTemperature(value: number): string {
  return `${Math.round(value)}°C`
}

export function WeatherPanel({
  city,
  error = null,
  loading = false,
  onCityChange,
  weather,
}: WeatherPanelProps) {
  const [draftCity, setDraftCity] = useState(city)
  const condition = weather ? getWeatherCondition(weather.weatherCode) : null

  useEffect(() => {
    let isActive = true

    queueMicrotask(() => {
      if (isActive) {
        setDraftCity(city)
      }
    })

    return () => {
      isActive = false
    }
  }, [city])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextCity = draftCity.trim()

    if (nextCity) {
      onCityChange(nextCity)
    }
  }

  return (
    <section
      aria-label="Current weather"
      className="w-full max-w-md rounded-lg border border-slate-200 bg-white/85 p-5 text-left shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-black/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Weather
          </p>
          <h2 className="truncate text-xl font-semibold text-slate-950 dark:text-slate-50">
            {weather?.city ?? city}
          </h2>
        </div>

        <div
          aria-label={condition?.label ?? 'Weather conditions'}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-950 dark:bg-slate-900 dark:text-slate-50"
          role="img"
        >
          {condition?.icon ?? '○'}
        </div>
      </div>

      <div className="mt-5 min-h-20">
        {loading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading weather...
          </p>
        ) : error ? (
          <p
            className="text-sm font-medium text-red-700 dark:text-red-300"
            role="alert"
          >
            {error}
          </p>
        ) : weather ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-3xl font-semibold tracking-normal text-slate-950 tabular-nums dark:text-slate-50">
                {formatTemperature(weather.temperature)}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Temperature
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-normal text-slate-950 tabular-nums dark:text-slate-50">
                {formatTemperature(weather.feelsLike)}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Feels like
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-normal text-slate-950 tabular-nums dark:text-slate-50">
                {weather.humidity}%
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Humidity
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No weather data available.
          </p>
        )}
      </div>

      <form className="mt-5 flex gap-2" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="weather-city">
          City
        </label>
        <input
          className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 transition-colors outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-600 dark:focus:ring-slate-50/10"
          id="weather-city"
          onChange={(event) => {
            setDraftCity(event.target.value)
          }}
          placeholder="City"
          type="text"
          value={draftCity}
        />
        <button
          className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-50 dark:focus-visible:ring-offset-slate-950"
          type="submit"
        >
          Update
        </button>
      </form>
    </section>
  )
}
