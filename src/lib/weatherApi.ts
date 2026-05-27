export interface WeatherData {
  city: string
  temperature: number
  feelsLike: number
  humidity: number
  weatherCode: number
}

interface GeocodingResult {
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

interface GeocodingResponse {
  results?: GeocodingResult[]
}

interface ForecastResponse {
  current?: {
    temperature_2m?: number
    apparent_temperature?: number
    relative_humidity_2m?: number
    weather_code?: number
  }
}

type Fetcher = typeof fetch

const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

function buildGeocodingUrl(city: string): string {
  const url = new URL(GEOCODING_ENDPOINT)
  url.searchParams.set('name', city)
  url.searchParams.set('count', '1')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')
  return url.toString()
}

function buildForecastUrl(latitude: number, longitude: number): string {
  const url = new URL(FORECAST_ENDPOINT)
  url.searchParams.set('latitude', latitude.toString())
  url.searchParams.set('longitude', longitude.toString())
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'weather_code',
    ].join(','),
  )
  url.searchParams.set('timezone', 'auto')
  return url.toString()
}

async function requestJson<T>(url: string, fetcher: Fetcher): Promise<T> {
  const response = await fetcher(url)

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

function requireNumber(value: unknown, fieldName: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Open-Meteo response missing ${fieldName}`)
  }

  return value
}

function formatResolvedCity(result: GeocodingResult): string {
  const region = result.admin1 ?? result.country
  return region ? `${result.name}, ${region}` : result.name
}

export async function fetchWeatherForCity(
  city: string,
  fetcher: Fetcher = fetch,
): Promise<WeatherData> {
  const normalizedCity = city.trim()

  if (!normalizedCity) {
    throw new Error('City name is required')
  }

  const geocoding = await requestJson<GeocodingResponse>(
    buildGeocodingUrl(normalizedCity),
    fetcher,
  )
  const location = geocoding.results?.[0]

  if (!location) {
    throw new Error(`No location found for "${normalizedCity}"`)
  }

  const forecast = await requestJson<ForecastResponse>(
    buildForecastUrl(location.latitude, location.longitude),
    fetcher,
  )
  const current = forecast.current

  if (!current) {
    throw new Error('Open-Meteo response missing current weather')
  }

  return {
    city: formatResolvedCity(location),
    temperature: requireNumber(current.temperature_2m, 'temperature'),
    feelsLike: requireNumber(
      current.apparent_temperature,
      'feels-like temperature',
    ),
    humidity: requireNumber(current.relative_humidity_2m, 'humidity'),
    weatherCode: requireNumber(current.weather_code, 'weather code'),
  }
}
