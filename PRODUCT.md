# Product Contract

## Overview

`alex-0d18-test-4` is a Vite, React, and TypeScript single-page clock and weather app. It shows the current time, date, and current weather in a centered responsive layout, and lets the user switch between 24-hour and 12-hour time.

## Current Capabilities

- Displays the current time with one-second updates.
- Displays the current long-form date.
- Supports 24-hour and 12-hour time formats.
- Persists the selected time format in `localStorage` with a safe default of 24-hour time.
- Provides an accessible switch-style format toggle.
- Displays current weather for the selected city, including condition icon, temperature, feels-like temperature, and humidity.
- Lets the user change the weather city from the page.
- Persists the selected city in `localStorage` with a safe default of `"London"`.
- Includes an Open-Meteo weather data layer that can fetch current weather for a city.
- Caches successful weather lookups in memory for 15 minutes to reduce repeat API calls.
- Uses Tailwind CSS for layout, typography, and component styling.
- Vite development and preview servers configured to bind to `0.0.0.0:8080`.
- Produces a static production bundle in `dist/` with `npm run build`.
- Documents bare self-hosting by serving the generated `dist/` files from any static file server.

## Architecture

- `src/App.tsx` composes the clock display, date display, format toggle, weather state, city preference, and WeatherPanel layout.
- `src/components/` contains `ClockDisplay`, `DateDisplay`, `FormatToggle`, and `WeatherPanel`.
- `src/hooks/useClock.ts` owns interval-based time updates and cleanup.
- `src/hooks/useFormatPreference.ts` owns localStorage-backed format preference state.
- `src/hooks/useCityPreference.ts` owns localStorage-backed city preference state.
- `src/hooks/useWeather.ts` owns current-weather loading, error state, stale-response protection, and short-lived in-memory caching.
- `src/lib/formatters.ts` contains pure date/time formatting helpers.
- `src/lib/weatherApi.ts` contains Open-Meteo geocoding and forecast API calls.
- `src/types/time.ts` contains the shared `TimeFormat` type.
- `src/index.css` defines Tailwind and global base styles.
- `e2e/` contains Playwright browser coverage for clock and weather flows, with Open-Meteo requests mocked.
- `README.md` documents production build verification and static self-host deployment from `dist/`.

## Conventions

- Use npm scripts: `dev`, `build`, `lint`, `format`, `format:check`, `test`, `test:e2e`, and `preview`.
- Treat `dist/` as generated deploy output: verify it with `npm run build`, but do not commit it.
- Unit and render tests use Vitest and Testing Library; browser tests use Playwright.
- Keep display formatting pure and tested separately from React components.
- Keep browser storage access guarded so unavailable storage falls back safely.
- Keep external API calls isolated in `src/lib/` and test hooks with mocked `fetch`.
- Mock Open-Meteo in Playwright tests; browser tests should not depend on live weather network calls.
- Keep generated output, local credentials, and Playwright artifacts out of git.
