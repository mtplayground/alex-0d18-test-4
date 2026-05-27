function App() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl items-center justify-center px-6 py-10">
      <section className="flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
          Clock
        </p>
        <div className="w-full rounded-lg border border-slate-200 bg-white/85 px-6 py-12 shadow-sm shadow-slate-200/80 backdrop-blur sm:px-10 dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-black/20">
          <h1 className="text-4xl font-semibold tracking-normal text-slate-950 sm:text-6xl dark:text-slate-50">
            Time display
          </h1>
        </div>
      </section>
    </main>
  )
}

export default App
