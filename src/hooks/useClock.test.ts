import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useClock } from './useClock'

describe('useClock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-27T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the current date and advances every second', () => {
    const { result } = renderHook(() => useClock())

    expect(result.current.toISOString()).toBe('2026-05-27T12:00:00.000Z')

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.toISOString()).toBe('2026-05-27T12:00:01.000Z')
  })

  it('cleans up the interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    const { unmount } = renderHook(() => useClock())

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)
  })
})
