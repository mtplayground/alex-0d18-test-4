import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CITY_PREFERENCE_STORAGE_KEY,
  DEFAULT_CITY,
  useCityPreference,
} from './useCityPreference'

describe('useCityPreference', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('defaults to London when storage is empty', () => {
    const { result } = renderHook(() => useCityPreference())

    expect(result.current[0]).toBe(DEFAULT_CITY)
  })

  it('round-trips the selected city through localStorage', () => {
    const { result, unmount } = renderHook(() => useCityPreference())

    act(() => {
      result.current[1]('Paris')
    })

    expect(result.current[0]).toBe('Paris')
    expect(window.localStorage.getItem(CITY_PREFERENCE_STORAGE_KEY)).toBe(
      'Paris',
    )

    unmount()

    const { result: nextResult } = renderHook(() => useCityPreference())

    expect(nextResult.current[0]).toBe('Paris')
  })

  it('trims city names before storing them', () => {
    const { result } = renderHook(() => useCityPreference())

    act(() => {
      result.current[1]('  New York  ')
    })

    expect(result.current[0]).toBe('New York')
    expect(window.localStorage.getItem(CITY_PREFERENCE_STORAGE_KEY)).toBe(
      'New York',
    )
  })

  it('falls back to London when storage contains a blank value', () => {
    window.localStorage.setItem(CITY_PREFERENCE_STORAGE_KEY, '   ')

    const { result } = renderHook(() => useCityPreference())

    expect(result.current[0]).toBe(DEFAULT_CITY)
  })

  it('falls back to London when storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage is unavailable')
    })

    const { result } = renderHook(() => useCityPreference())

    expect(result.current[0]).toBe(DEFAULT_CITY)
  })

  it('updates in-memory state when storage cannot be written', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage is unavailable')
    })

    const { result } = renderHook(() => useCityPreference())

    act(() => {
      result.current[1]('Madrid')
    })

    expect(result.current[0]).toBe('Madrid')
  })

  it('uses London when the selected city is blank', () => {
    const { result } = renderHook(() => useCityPreference())

    act(() => {
      result.current[1]('   ')
    })

    expect(result.current[0]).toBe(DEFAULT_CITY)
    expect(window.localStorage.getItem(CITY_PREFERENCE_STORAGE_KEY)).toBe(
      DEFAULT_CITY,
    )
  })
})
