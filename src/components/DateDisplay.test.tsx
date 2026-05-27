import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DateDisplay } from './DateDisplay'

describe('DateDisplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 27, 15, 45, 9))
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders the formatted current date in a centered time element', () => {
    render(<DateDisplay />)

    const date = screen.getByLabelText('Current date')

    expect(date.tagName).toBe('TIME')
    expect(date.textContent).toBe('Wednesday, May 27, 2026')
    expect(date.getAttribute('dateTime')).toBe('2026-05-27')
    expect(date.className).toContain('text-center')
  })

  it('updates when the clock advances to the next date', () => {
    vi.setSystemTime(new Date(2026, 4, 27, 23, 59, 59))

    render(<DateDisplay />)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    const date = screen.getByLabelText('Current date')

    expect(date.textContent).toBe('Thursday, May 28, 2026')
    expect(date.getAttribute('dateTime')).toBe('2026-05-28')
  })
})
