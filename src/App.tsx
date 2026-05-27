import { ClockDisplay } from './components/ClockDisplay'
import { DateDisplay } from './components/DateDisplay'
import { FormatToggle } from './components/FormatToggle'
import { WeatherPanel } from './components/WeatherPanel'
import { useCityPreference } from './hooks/useCityPreference'
import { useFormatPreference } from './hooks/useFormatPreference'
import { useWeather } from './hooks/useWeather'

function App() {
  const [formatPreference, setFormatPreference] = useFormatPreference()
  const [cityPreference, setCityPreference] = useCityPreference()
  const weatherState = useWeather(cityPreference)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl items-center justify-center px-6 py-10">
      <section className="flex w-full flex-col items-center justify-center gap-8 text-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <ClockDisplay mode={formatPreference} />
              <DateDisplay />
            </div>

            <WeatherPanel
              city={cityPreference}
              error={weatherState.error}
              loading={weatherState.loading}
              onCityChange={setCityPreference}
              weather={weatherState.data}
            />
          </div>

          <div className="flex justify-center lg:justify-end">
            <FormatToggle
              onChange={setFormatPreference}
              value={formatPreference}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
