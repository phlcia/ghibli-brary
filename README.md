# ghibli-brary

ghibli-brary is a production-ready full-stack web app built with Next.js 15 App Router, TypeScript, Prisma, and Tailwind CSS. It lets you browse, search, sort, and filter Studio Ghibli films using the public [Ghibli API](https://ghibliapi.vercel.app/films) while persisting favorites in PostgreSQL.

## Features

- Server-side data fetching with a 60 second in-memory cache to limit API calls
- Responsive layout with keyboard-accessible navigation and AA compliant colors
- Client-side search, multi-select filters (director, producer, release year), minimum RT score slider, and sort controls synced to URL query params
- Favorites system backed by Prisma/Postgres with credential-based auth via NextAuth
- Dedicated film detail route (`/film/[id]`) with banner art, metadata, and synopsis
- Jest unit tests for filtering utilities, Prisma-backed API integrations, and Playwright E2E coverage
- ESLint + Prettier configured with project scripts for linting, formatting, and testing

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to access the app. The dev server uses Turbopack for fast refresh.

### Environment

Create a `.env` file with the following values (adjust as needed):

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/ghibli
DIRECT_DATABASE_URL=postgresql://<user>:<password>@localhost:5432/ghibli
SHADOW_DATABASE_URL=postgresql://<user>:<password>@localhost:5432/ghibli_shadow
NEXTAUTH_SECRET=some-long-random-string
NEXTAUTH_URL=http://localhost:3000
```

Apply database migrations and generate the Prisma client:

```bash
npm run prisma:generate
npx prisma migrate deploy
```

## Available Scripts

- `npm run dev` – start the development server
- `npm run build` – create an optimized production build
- `npm start` – run the production server
- `npm run lint` – run ESLint
- `npm run format` – verify formatting with Prettier
- `npm test` – run Jest unit tests (integration tests for `/api/favorites` run when `RUN_FAVORITES_INTEGRATION=true`)
- `npm run test:e2e` – execute Playwright end-to-end tests
- `npm run prisma:generate` – generate the Prisma client
- `npm run prisma:migrate` – run Prisma migrations in the current database

## Project Structure

```
app/                 # Next.js app router entry points
components/          # Reusable UI building blocks
components/forms     # Auth forms
components/providers # Client-side providers (e.g. NextAuth session)
lib/                 # Data fetching, Prisma client, and auth helpers
prisma/              # Prisma schema and migrations
tests/               # Jest integration/unit tests and Playwright specs
types/               # Shared TypeScript types and NextAuth augmentation
```

## Testing

Jest is configured with ts-jest and uses `tsconfig.jest.json` for CommonJS compatibility. Run `npm test` to execute unit tests. Integration coverage for `/api/favorites` is available by enabling `RUN_FAVORITES_INTEGRATION=true`. Playwright powers the end-to-end flow in `tests/e2e`.

## Accessibility & Performance

- Semantic HTML, labeled controls, and keyboard-focus styles are provided throughout the UI
- Tailwind color combinations meet WCAG AA contrast requirements
- Skeleton states and lazy navigation keep perceived performance high while data loads

## API Usage

The app consumes `GET https://ghibliapi.vercel.app/films` and `GET /films/{id}` for detail pages. Responses are cached in-memory for 60 seconds, while the favorites API persists a normalized film record plus the full payload in PostgreSQL.

## License

This project was created for educational purposes! Huge shoutout to @deywersonp for the Ghibli API (https://github.com/deywersonp/ghibliapi?tab=readme-ov-file) :P
