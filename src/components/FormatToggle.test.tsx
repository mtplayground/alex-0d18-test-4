import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { FORMAT_PREFERENCE_STORAGE_KEY } from '../hooks/useFormatPreference'
import { FormatToggle } from './FormatToggle'

describe('FormatToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    window.localStorage.clear()
  })

  it('toggles the stored format preference when clicked', () => {
    render(<FormatToggle />)

    const toggle = screen.getByRole('switch', { name: 'Use 24-hour time' })

    expect(toggle.getAttribute('aria-checked')).toBe('true')
    expect(window.localStorage.getItem(FORMAT_PREFERENCE_STORAGE_KEY)).toBe(
      null,
    )

    fireEvent.click(toggle)

    expect(toggle.getAttribute('aria-checked')).toBe('false')
    expect(window.localStorage.getItem(FORMAT_PREFERENCE_STORAGE_KEY)).toBe(
      '12',
    )
  })
})
