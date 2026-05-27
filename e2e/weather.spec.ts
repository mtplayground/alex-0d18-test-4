import { expect, test } from '@playwright/test'

const locations = {
  london: {
    name: 'London',
    latitude: 51.5072,
    longitude: -0.1276,
    country: 'United Kingdom',
  },
  paris: {
    name: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    country: 'France',
  },
}

const forecasts = {
  london: {
    temperature_2m: 17,
    apparent_temperature: 16,
    relative_humidity_2m: 71,
    weather_code: 2,
  },
  paris: {
    temperature_2m: 22,
    apparent_temperature: 21,
    relative_humidity_2m: 62,
    weather_code: 0,
  },
}

test('shows weather and updates when the city changes', async ({ page }) => {
  await page.route(
    'https://geocoding-api.open-meteo.com/v1/search**',
    async (route) => {
      const url = new URL(route.request().url())
      const requestedCity = url.searchParams.get('name')?.toLowerCase()
      const location =
        requestedCity === 'paris' ? locations.paris : locations.london

      await route.fulfill({
        json: {
          results: [location],
        },
      })
    },
  )

  await page.route(
    'https://api.open-meteo.com/v1/forecast**',
    async (route) => {
      const url = new URL(route.request().url())
      const latitude = Number(url.searchParams.get('latitude'))
      const forecast =
        Math.abs(latitude - locations.paris.latitude) < 0.01
          ? forecasts.paris
          : forecasts.london

      await route.fulfill({
        json: {
          current: forecast,
        },
      })
    },
  )

  await page.goto('/')

  const weatherPanel = page.getByRole('region', { name: 'Current weather' })

  await expect(weatherPanel).toBeVisible()
  await expect(weatherPanel.getByText('London, United Kingdom')).toBeVisible()
  await expect(weatherPanel.getByText('17°C')).toBeVisible()
  await expect(weatherPanel.getByText('71%')).toBeVisible()

  await page.getByLabel('City').fill('Paris')
  await page.getByRole('button', { name: 'Update' }).click()

  await expect(weatherPanel.getByText('Paris, France')).toBeVisible()
  await expect(weatherPanel.getByText('22°C')).toBeVisible()
  await expect(weatherPanel.getByText('62%')).toBeVisible()
  await expect(
    weatherPanel.getByRole('img', { name: 'Clear sky' }),
  ).toBeVisible()

  await page.reload()

  await expect(weatherPanel.getByText('Paris, France')).toBeVisible()
})
