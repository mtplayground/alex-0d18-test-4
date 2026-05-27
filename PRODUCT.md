# Product Contract

## Overview

`alex-0d18-test-4` is a minimal Vite, React, and TypeScript single-page application scaffold. It currently provides the baseline project structure for future frontend work rather than domain-specific product functionality.

## Current Capabilities

- React application bootstrapped through `src/main.tsx` and rendered from `src/App.tsx`.
- Vite development and preview servers configured to bind to `0.0.0.0:8080`.
- TypeScript project references split across app, node, and root `tsconfig` files.
- ESLint configured for TypeScript, React Hooks, and React Refresh.
- Minimal `.env.example` placeholder for local environment configuration.

## Architecture

- Root configuration includes `package.json`, `vite.config.ts`, `eslint.config.js`, `tsconfig.json`, and related TypeScript configs.
- Application source lives under `src/`.
- Static public assets live under `public/`.
- Build output is generated into `dist/` and is not tracked.

## Conventions

- Use npm scripts for development: `npm run dev`, `npm run build`, `npm run lint`, and `npm run preview`.
- Keep local secrets and runtime files out of git via `.gitignore`.
- Add shared application types under `src/types/` when domain models are introduced.
