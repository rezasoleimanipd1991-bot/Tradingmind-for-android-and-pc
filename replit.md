# TraderMind OS

ژورنال معاملاتی آفلاین TraderMind OS — نرم‌افزار جامع ثبت، تحلیل و بررسی معاملات برای تریدرها. کاملاً آفلاین با ذخیره‌سازی محلی (IndexedDB).

## Run & Operate

- `pnpm --filter @workspace/tradermind run dev` — run the TraderMind web app (port 23583)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/tradermind run build` — build for production
- `pnpm --filter @workspace/tradermind run android:build:vite` — build for Capacitor/Android
- `pnpm --filter @workspace/tradermind run electron:build:win` — build Windows installer (requires Windows env)

## Stack

- **Frontend**: React 19 + Vite + TailwindCSS v4 + shadcn/ui
- **Storage**: IndexedDB via Dexie.js (fully offline, no server needed)
- **Mobile**: Capacitor 7 (Android/iOS)
- **Desktop**: Electron 39 (Windows/macOS)
- **State**: Zustand + TanStack React Query
- **i18n**: Persian (RTL) UI
- **Testing**: Vitest

## Where things live

- `artifacts/tradermind/src/` — all React source code
- `artifacts/tradermind/src/db/database.ts` — Dexie database schema + migrations (source of truth for data model)
- `artifacts/tradermind/src/services/` — business logic and data services
- `artifacts/tradermind/src/pages/` — page components (routed via wouter)
- `artifacts/tradermind/src/components/` — shared UI components
- `artifacts/tradermind/src/types/` — TypeScript type definitions
- `artifacts/tradermind/electron/` — Electron main process files
- `artifacts/tradermind/capacitor.config.ts` — Capacitor configuration
- `artifacts/tradermind/electron-builder.json` — Windows/macOS build config
- `artifacts/api-server/` — Express API server (health check only; app is offline)

## Architecture decisions

- **Fully offline**: All data stored in browser IndexedDB via Dexie. No backend API calls from the app.
- **Code splitting**: All pages are lazy-loaded with `lazyWithRecovery()` for fast initial load.
- **Electron routing**: Uses hash-based routing (`#/path`) when running under `file://` protocol in Electron; web routing otherwise.
- **Capacitor**: Android builds use `vite.capacitor.config.ts` (outputs to `dist/capacitor/`); Electron uses `vite.electron.config.ts`.
- **Screenshot Intelligence**: Rule-based visual feature extraction from trade metadata — no external AI calls. Stores screenshots as Blobs in IndexedDB (v21+ migration converts Base64 to Blob to save RAM).
- **patternTags field**: Stored as JSON string (not indexed in Dexie); always use `.filter()` to query, never `.where('patternTags').equals()`.

## Product

- **Dashboard**: Overview of performance, recent trades, daily journal status
- **Strategies**: Build and run step-by-step trading strategy checklists
- **Trade Journal**: Log, review, and analyze trades with screenshots, emotions, notes
- **Screenshot Intelligence**: Upload chart screenshots, tag patterns, find similar setups, track pattern performance
- **Advanced Analytics**: Performance metrics, edge analytics, risk management, psychology tracking
- **Knowledge Base**: Personal trading rules and lessons
- **Backup/Restore**: Full data export/import in JSON/CSV

## Gotchas

- `patternTags` in `ChartScreenshot` table is a JSON string — use `filter()` not `where().equals()` for queries
- Capacitor filesystem APIs are wrapped with `Capacitor.isNativePlatform()` — safe for web
- Building APK requires Android SDK (not available in Replit) — use local machine with Android Studio
- Building setup.exe requires Windows or Wine (not available in Replit) — use local machine or CI
- GitHub push requires user to connect their GitHub account to Replit (Git pane)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- GitHub repo: https://github.com/REZASLMY/Trader-mine-for-PC.git
