import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { WeatherData } from '../lib/weatherApi'
import { WeatherPanel } from './WeatherPanel'

const mockWeather: WeatherData = {
  city: 'London, England',
  temperature: 16.4,
  feelsLike: 14.8,
  humidity: 72,
  weatherCode: 2,
}

describe('WeatherPanel', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders weather details with a mapped condition icon', () => {
    render(
      <WeatherPanel
        city="London"
        onCityChange={() => undefined}
        weather={mockWeather}
      />,
    )

    expect(screen.getByRole('region', { name: 'Current weather' })).toBeTruthy()
    expect(screen.getByText('London, England')).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Partly cloudy' })).toBeTruthy()
    expect(screen.getByText('16°C')).toBeTruthy()
    expect(screen.getByText('Temperature')).toBeTruthy()
    expect(screen.getByText('15°C')).toBeTruthy()
    expect(screen.getByText('Feels like')).toBeTruthy()
    expect(screen.getByText('72%')).toBeTruthy()
    expect(screen.getByText('Humidity')).toBeTruthy()
  })

  it('submits a trimmed city name', () => {
    const handleCityChange = vi.fn()

    render(
      <WeatherPanel
        city="London"
        onCityChange={handleCityChange}
        weather={mockWeather}
      />,
    )

    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: '  Paris  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Update' }))

    expect(handleCityChange).toHaveBeenCalledWith('Paris')
  })

  it('does not submit a blank city name', () => {
    const handleCityChange = vi.fn()

    render(
      <WeatherPanel
        city="London"
        onCityChange={handleCityChange}
        weather={mockWeather}
      />,
    )

    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: '   ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Update' }))

    expect(handleCityChange).not.toHaveBeenCalled()
  })

  it('renders loading and error states', () => {
    const { rerender } = render(
      <WeatherPanel
        city="London"
        loading
        onCityChange={() => undefined}
        weather={null}
      />,
    )

    expect(screen.getByText('Loading weather...')).toBeTruthy()

    rerender(
      <WeatherPanel
        city="London"
        error="Unable to load weather"
        onCityChange={() => undefined}
        weather={null}
      />,
    )

    expect(screen.getByRole('alert').textContent).toBe('Unable to load weather')
  })
})
