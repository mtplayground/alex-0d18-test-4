import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_TIME_FORMAT,
  FORMAT_PREFERENCE_STORAGE_KEY,
  useFormatPreference,
} from './useFormatPreference'

describe('useFormatPreference', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('defaults to 24-hour format when storage is empty', () => {
    const { result } = renderHook(() => useFormatPreference())

    expect(result.current[0]).toBe(DEFAULT_TIME_FORMAT)
  })

  it('round-trips the selected format through localStorage', () => {
    const { result, unmount } = renderHook(() => useFormatPreference())

    act(() => {
      result.current[1]('12')
    })

    expect(result.current[0]).toBe('12')
    expect(window.localStorage.getItem(FORMAT_PREFERENCE_STORAGE_KEY)).toBe(
      '12',
    )

    unmount()

    const { result: nextResult } = renderHook(() => useFormatPreference())

    expect(nextResult.current[0]).toBe('12')
  })

  it('falls back to 24-hour format when storage contains an invalid value', () => {
    window.localStorage.setItem(FORMAT_PREFERENCE_STORAGE_KEY, 'invalid')

    const { result } = renderHook(() => useFormatPreference())

    expect(result.current[0]).toBe(DEFAULT_TIME_FORMAT)
  })

  it('falls back to 24-hour format when storage cannot be read', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage is unavailable')
    })

    const { result } = renderHook(() => useFormatPreference())

    expect(result.current[0]).toBe(DEFAULT_TIME_FORMAT)
  })

  it('updates in-memory state when storage cannot be written', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage is unavailable')
    })

    const { result } = renderHook(() => useFormatPreference())

    act(() => {
      result.current[1]('12')
    })

    expect(result.current[0]).toBe('12')
  })
})
