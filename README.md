# Learning Room Tuition Website

A responsive tuition website and classroom preview built with Next.js App Router, TypeScript, Tailwind CSS, and Mux player components. This checkout currently runs as a local-only preview: Supabase authentication, database, storage, and network clients have been removed from the application. The SQL and migration files are preserved as reference files and are not run by the app.

## Start locally

Requirements: Node.js and the installed project dependencies. `package.json` pins pnpm 11.25.0, but the bundled pnpm command in this Windows Codex workspace currently fails before startup with a workspace-store symlink `EPERM` error.

The development server is running on port 3001 for this preview. Open [http://localhost:3001](http://localhost:3001). Keep the Codex server session running while you use the site.

If you need to restart it from PowerShell, run:

```powershell
cd "C:\Users\SD PRINCE\OneDrive\Documents\ChatGPT\tution"
$env:NEXT_DIST_DIR = ".next-local-preview-check"
node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3001
```

Leave that PowerShell window open. The separate build directory avoids colliding with another existing Next.js dev cache. `.env.local` is not required for local preview. Next.js may load that file into its process environment, but the application does not initialize a Supabase client or make Supabase requests. The file is intentionally left untouched.

On `/login`, use **Preview as student** or **Preview as teacher**. These create a local preview session only; they are not real accounts. Sample lessons, batches, announcements, and schedule data are synthetic. Course checkpoints and weekly goals are stored only in this browser's local storage. Real sign-in, registration, account profiles, database-backed batch changes, enrollment, announcements, study-material storage, private video playback, and live-class operations are unavailable in this local-only version. The contact form opens your email app; it does not send or store a message on the website.

## Checks

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If the same pnpm `EPERM` error occurs, the checks used in this workspace can be run directly against the already installed tools:

```powershell
node node_modules/eslint/bin/eslint.js
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run
$env:NEXT_DIST_DIR = ".next-build-preview"
node node_modules/next/dist/bin/next build --webpack
```

## Service status

- Supabase SDK packages and runtime initialization have been removed from `package.json` and the application source. Authentication and data APIs are disconnected; local preview does not need Supabase credentials or network access.
- Mux server routes remain in source. The local preview deliberately disables private playback and cannot run real live-class workflows without verified accounts and database-backed enrollment/session data. Presence of Mux variables in `.env.local` does not mean that the Mux workflow has been validated.
- `supabase/` contains preserved SQL/migration reference files only. Nothing here modifies the hosted `learning-room` project.
- `.env.local` is preserved. Do not paste secrets into chat.

To restore account-backed functionality later, the Supabase client, auth, protected APIs, and storage integration must be deliberately reimplemented and reviewed. This codebase does not currently connect to the existing Supabase project.

## Main folders

- `app/` — public pages, dashboard pages, and API routes
- `components/` — shared site, portal, and form components
- `lib/` — app helpers and the local-only data boundary
- `supabase/` — preserved database SQL and migrations, not executed by the app
