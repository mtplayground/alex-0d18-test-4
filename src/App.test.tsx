import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import App from './App'
import { FORMAT_PREFERENCE_STORAGE_KEY } from './hooks/useFormatPreference'

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 4, 27, 15, 45, 9))
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    window.localStorage.clear()
  })

  it('shares the lifted format preference between the clock and toggle', () => {
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
})
