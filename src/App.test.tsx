import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import App from './App'
import { CITY_PREFERENCE_STORAGE_KEY } from './hooks/useCityPreference'
import { FORMAT_PREFERENCE_STORAGE_KEY } from './hooks/useFormatPreference'
import { clearWeatherCacheForTests } from './hooks/useWeather'

function mockJsonResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as Response
}

function mockWeatherFetch(city: string, weatherCode = 1) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(
      mockJsonResponse({
        results: [
          {
            name: city,
            latitude: 51.5072,
            longitude: -0.1276,
            country: 'United Kingdom',
          },
        ],
      }),
    )
    .mockResolvedValueOnce(
      mockJsonResponse({
        current: {
          temperature_2m: 17,
          apparent_temperature: 16,
          relative_humidity_2m: 71,
          weather_code: weatherCode,
        },
      }),
    )
}

describe('App', () => {
  beforeEach(() => {
    clearWeatherCacheForTests()
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
    clearWeatherCacheForTests()
    window.localStorage.clear()
  })

  it('shares the lifted format preference between the clock and toggle', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 27, 15, 45, 9))
    mockWeatherFetch('London')

    render(<App />)

    const clock = screen.getByLabelText('Current time')
    const toggle = screen.getByRole('switch', { name: 'Use 24-hour time' })

    expect(clock.textContent).toBe('15:45:09')
    expect(toggle.getAttribute('aria-checked')).toBe('true')

    fireEvent.click(toggle)

    expect(clock.textContent).toBe('03:45:09 PM')
    expect(toggle.getAttribute('aria-checked')).toBe('false')
    expect(window.localStorage.getItem(FORMAT_PREFERENCE_STORAGE_KEY)).toBe(
      '12',
    )
  })

  it('renders weather below the date display and updates the city preference', async () => {
    const fetchMock = mockWeatherFetch('London').mockResolvedValueOnce(
      mockJsonResponse({
        results: [
          {
            name: 'Paris',
            latitude: 48.8566,
            longitude: 2.3522,
            country: 'France',
          },
        ],
      }),
    )
    fetchMock.mockResolvedValueOnce(
      mockJsonResponse({
        current: {
          temperature_2m: 22,
          apparent_temperature: 21,
          relative_humidity_2m: 62,
          weather_code: 0,
        },
      }),
    )

    render(<App />)

    expect(screen.getByRole('region', { name: 'Current weather' })).toBeTruthy()
    expect(await screen.findByText('London, United Kingdom')).toBeTruthy()
    expect(screen.getByText('17°C')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Paris' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Update' }))

    expect(window.localStorage.getItem(CITY_PREFERENCE_STORAGE_KEY)).toBe(
      'Paris',
    )
    expect(await screen.findByText('Paris, France')).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Clear sky' })).toBeTruthy()
  })
})
