import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { clearWeatherCacheForTests, useWeather } from './useWeather'

function mockJsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response
}

describe('useWeather', () => {
  beforeEach(() => {
    clearWeatherCacheForTests()
    vi.spyOn(Date, 'now').mockReturnValue(
      new Date('2026-05-27T12:00:00.000Z').getTime(),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    clearWeatherCacheForTests()
  })

  it('fetches current weather for a city', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        mockJsonResponse({
          results: [
            {
              name: 'New York',
              latitude: 40.7128,
              longitude: -74.006,
              admin1: 'New York',
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        mockJsonResponse({
          current: {
            temperature_2m: 21.4,
            apparent_temperature: 20.9,
            relative_humidity_2m: 58,
            weather_code: 3,
          },
        }),
      )

    const { result } = renderHook(() => useWeather('New York'))

    await waitFor(() => {
      expect(result.current.data).not.toBeNull()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual({
      city: 'New York, New York',
      temperature: 21.4,
      feelsLike: 20.9,
      humidity: 58,
      weatherCode: 3,
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][0].toString()).toContain(
      'geocoding-api.open-meteo.com',
    )
    expect(fetchMock.mock.calls[1][0].toString()).toContain(
      'api.open-meteo.com',
    )
  })

  it('returns an error when the city is empty', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    const { result } = renderHook(() => useWeather('   '))

    await waitFor(() => {
      expect(result.current).toEqual({
        data: null,
        error: 'City name is required',
        loading: false,
      })
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns an error when no geocoding result is found', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      mockJsonResponse({ results: [] }),
    )

    const { result } = renderHook(() => useWeather('Atlantis'))

    await waitFor(() => {
      expect(result.current.error).toBe('No location found for "Atlantis"')
    })

    expect(result.current.data).toBeNull()
  })

  it('caches successful responses for 15 minutes', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
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
      .mockResolvedValueOnce(
        mockJsonResponse({
          current: {
            temperature_2m: 18,
            apparent_temperature: 17,
            relative_humidity_2m: 65,
            weather_code: 1,
          },
        }),
      )

    const first = renderHook(({ city }) => useWeather(city), {
      initialProps: { city: 'Paris' },
    })

    await waitFor(() => {
      expect(first.result.current.loading).toBe(false)
    })

    first.unmount()

    const second = renderHook(({ city }) => useWeather(city), {
      initialProps: { city: 'paris' },
    })

    await waitFor(() => {
      expect(second.result.current).toEqual({
        data: {
          city: 'Paris, France',
          temperature: 18,
          feelsLike: 17,
          humidity: 65,
          weatherCode: 1,
        },
        error: null,
        loading: false,
      })
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('refreshes cached responses after 15 minutes', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        mockJsonResponse({
          results: [
            {
              name: 'Berlin',
              latitude: 52.52,
              longitude: 13.405,
              country: 'Germany',
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        mockJsonResponse({
          current: {
            temperature_2m: 10,
            apparent_temperature: 9,
            relative_humidity_2m: 70,
            weather_code: 2,
          },
        }),
      )
      .mockResolvedValueOnce(
        mockJsonResponse({
          results: [
            {
              name: 'Berlin',
              latitude: 52.52,
              longitude: 13.405,
              country: 'Germany',
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        mockJsonResponse({
          current: {
            temperature_2m: 12,
            apparent_temperature: 11,
            relative_humidity_2m: 68,
            weather_code: 3,
          },
        }),
      )

    const first = renderHook(() => useWeather('Berlin'))

    await waitFor(() => {
      expect(first.result.current.loading).toBe(false)
    })

    first.unmount()

    vi.mocked(Date.now).mockReturnValue(
      new Date('2026-05-27T12:16:00.000Z').getTime(),
    )

    const second = renderHook(() => useWeather('Berlin'))

    await waitFor(() => {
      expect(second.result.current.data?.temperature).toBe(12)
    })

    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('ignores stale responses after the city changes', async () => {
    let resolveFirstGeocoding: (response: Response) => void = () => undefined
    const firstGeocoding = new Promise<Response>((resolve) => {
      resolveFirstGeocoding = resolve
    })

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockReturnValueOnce(firstGeocoding)
      .mockResolvedValueOnce(
        mockJsonResponse({
          results: [
            {
              name: 'Madrid',
              latitude: 40.4168,
              longitude: -3.7038,
              country: 'Spain',
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        mockJsonResponse({
          current: {
            temperature_2m: 24,
            apparent_temperature: 23,
            relative_humidity_2m: 41,
            weather_code: 0,
          },
        }),
      )
      .mockResolvedValueOnce(
        mockJsonResponse({
          current: {
            temperature_2m: 4,
            apparent_temperature: 2,
            relative_humidity_2m: 80,
            weather_code: 71,
          },
        }),
      )

    const { result, rerender } = renderHook(({ city }) => useWeather(city), {
      initialProps: { city: 'Oslo' },
    })

    rerender({ city: 'Madrid' })

    await waitFor(() => {
      expect(result.current.data?.city).toBe('Madrid, Spain')
    })

    resolveFirstGeocoding(
      mockJsonResponse({
        results: [
          {
            name: 'Oslo',
            latitude: 59.9139,
            longitude: 10.7522,
            country: 'Norway',
          },
        ],
      }),
    )

    await Promise.resolve()

    expect(result.current.data?.city).toBe('Madrid, Spain')
    expect(fetchMock).toHaveBeenCalled()
  })
})
