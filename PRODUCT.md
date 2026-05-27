# Product Contract

## Overview

`alex-0d18-test-4` is a Vite, React, and TypeScript single-page clock app. It shows the current time and date in a centered full-viewport layout and lets the user switch between 24-hour and 12-hour time.

## Current Capabilities

- Displays the current time with one-second updates.
- Displays the current long-form date.
- Supports 24-hour and 12-hour time formats.
- Persists the selected time format in `localStorage` with a safe default of 24-hour time.
- Provides an accessible switch-style format toggle.
- Uses Tailwind CSS for layout, typography, and component styling.
- Vite development and preview servers configured to bind to `0.0.0.0:8080`.

## Architecture

- `src/App.tsx` composes the clock display, date display, and format toggle. It owns the shared format preference state.
- `src/components/` contains `ClockDisplay`, `DateDisplay`, and `FormatToggle`.
- `src/hooks/useClock.ts` owns interval-based time updates and cleanup.
- `src/hooks/useFormatPreference.ts` owns localStorage-backed format preference state.
- `src/lib/formatters.ts` contains pure date/time formatting helpers.
- `src/types/time.ts` contains the shared `TimeFormat` type.
- `src/index.css` defines Tailwind and global base styles.
- `e2e/` contains Playwright browser coverage for the user-facing clock flow.

## Conventions

- Use npm scripts: `dev`, `build`, `lint`, `format`, `format:check`, `test`, `test:e2e`, and `preview`.
- Unit and render tests use Vitest and Testing Library; browser tests use Playwright.
- Keep display formatting pure and tested separately from React components.
- Keep browser storage access guarded so unavailable storage falls back safely.
- Keep generated output, local credentials, and Playwright artifacts out of git.
