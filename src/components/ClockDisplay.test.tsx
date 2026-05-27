import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ClockDisplay } from './ClockDisplay'

describe('ClockDisplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 27, 15, 45, 9))
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders the current time in a large time element', () => {
    render(<ClockDisplay mode="24" />)

    const time = screen.getByLabelText('Current time')

    expect(time.tagName).toBe('TIME')
    expect(time.textContent).toBe('15:45:09')
    expect(time.className).toContain('text-5xl')
    expect(time.className).toContain('text-center')
  })

  it('uses the requested 12-hour format', () => {
    render(<ClockDisplay mode="12" />)

    expect(screen.getByLabelText('Current time').textContent).toBe(
      '03:45:09 PM',
    )
  })

  it('updates as the clock advances', () => {
    render(<ClockDisplay mode="24" />)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByLabelText('Current time').textContent).toBe('15:45:10')
  })
})
