import { ClockDisplay } from './components/ClockDisplay'
import { DateDisplay } from './components/DateDisplay'
import { FormatToggle } from './components/FormatToggle'
import { useFormatPreference } from './hooks/useFormatPreference'

function App() {
  const [formatPreference, setFormatPreference] = useFormatPreference()

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl items-center justify-center px-6 py-10">
      <section className="flex w-full flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <ClockDisplay mode={formatPreference} />
          <DateDisplay />
        </div>

        <FormatToggle onChange={setFormatPreference} value={formatPreference} />
      </section>
    </main>
  )
}

export default App
