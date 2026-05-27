import { describe, expect, it } from 'vitest'

import { formatDate, formatTime } from './formatters'

describe('formatTime', () => {
  it('formats time in 12-hour mode', () => {
    const date = new Date(2026, 4, 27, 15, 45, 9)

    expect(formatTime(date, '12')).toBe('03:45:09 PM')
  })

  it('formats time in 24-hour mode', () => {
    const date = new Date(2026, 4, 27, 15, 45, 9)

    expect(formatTime(date, '24')).toBe('15:45:09')
  })

  it('formats midnight correctly in both modes', () => {
    const midnight = new Date(2026, 4, 27, 0, 0, 0)

    expect(formatTime(midnight, '12')).toBe('12:00:00 AM')
    expect(formatTime(midnight, '24')).toBe('00:00:00')
  })

  it('formats noon correctly in both modes', () => {
    const noon = new Date(2026, 4, 27, 12, 0, 0)

    expect(formatTime(noon, '12')).toBe('12:00:00 PM')
    expect(formatTime(noon, '24')).toBe('12:00:00')
  })
})

describe('formatDate', () => {
  it('formats a long weekday date', () => {
    const date = new Date(2026, 4, 27, 15, 45, 9)

    expect(formatDate(date)).toBe('Wednesday, May 27, 2026')
  })
})
