# ghibli-brary

ghibli-brary is a production-ready web app built with Next.js 15 App Router, TypeScript, and Tailwind CSS. It lets you browse, search, sort, and filter Studio Ghibli films using the public [Ghibli API](https://ghibliapi.vercel.app/films).

## Features

- Server-side data fetching with a 60 second in-memory cache to limit API calls
- Responsive layout with keyboard-accessible navigation and AA compliant colors
- Client-side search, multi-select filters (director, producer, release year), minimum RT score slider, and sort controls synced to URL query params
- Paginated film grid (12 per page) with skeleton loaders, graceful error states, and image placeholders
- Dedicated film detail route (`/film/[id]`) with banner art, metadata, and synopsis
- Jest unit tests for filtering utilities and the data fetcher
- ESLint + Prettier configured with project scripts for linting, formatting, and testing

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to access the app. The dev server uses Turbopack for fast refresh.

## Available Scripts

- `npm run dev` – start the development server
- `npm run build` – create an optimized production build
- `npm start` – run the production server
- `npm run lint` – run ESLint
- `npm run format` – verify formatting with Prettier
- `npm test` – run Jest unit tests

## Project Structure

```
app/            # Next.js app router entry points
components/     # Reusable UI building blocks
lib/            # Data fetching utilities and filtering helpers
public/         # Static assets
tests/          # Jest unit tests
types/          # Shared TypeScript types
```

## Testing

Jest is configured with ts-jest and uses `tsconfig.jest.json` for CommonJS compatibility. Run `npm test` to execute the unit suite.

## Accessibility & Performance

- Semantic HTML, labeled controls, and keyboard-focus styles are provided throughout the UI
- Tailwind color combinations meet WCAG AA contrast requirements
- Skeleton states and lazy navigation keep perceived performance high while data loads

## API Usage

The app consumes `GET https://ghibliapi.vercel.app/films` and optionally `GET /films/{id}` for detail pages. Responses are cached in-memory for 60 seconds to minimize network requests during active sessions.

## License

This project is provided as-is for educational purposes.
