# alex-0d18-test-4

A Vite, React, and TypeScript application scaffold.

## Scripts

- `npm run dev` starts the Vite development server on `0.0.0.0:8080`.
- `npm run build` type-checks the project and creates a production build in `dist/`.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally on `0.0.0.0:8080`.

## Production build

Install dependencies and build the static bundle:

```bash
npm ci
npm run build
```

The build command runs TypeScript checks and `vite build`. A successful build creates a clean `dist/` directory containing the static files to deploy, including `index.html`, copied files from `public/`, and versioned assets under `dist/assets/`.

To inspect the production bundle locally:

```bash
npm run preview
```

## Self-hosting

Deploy the contents of `dist/` to any static file server. The server should serve `dist/index.html` at the site root and make the copied assets available with their existing paths.

For a bare server, one simple option is:

```bash
npx serve -s dist
```

Equivalent setups with Nginx, Caddy, Apache, object storage, or a CDN work as long as they publish the files from `dist/`. If client-side routes are added later, configure the server to fall back to `index.html` for unknown paths.

## Configuration

Copy `.env.example` to `.env.local` for local environment values.
