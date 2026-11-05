# KALASAG Web Console

Operator console for **KALASAG** — a post-earthquake survivor distress network built on pre-configured LoRa nodes. Responders use it to watch the coverage map, track active distress signals, and manage devices, distress records, and operator accounts.

The UI is built from the Figma file [PRESENTATION – FINAL](https://www.figma.com/design/ELCeTJs6b2o0oWeYRnWCoh/PRESENTATION---FINAL?node-id=0-1) (Page 1 screens, colors and type from the *Typography & Palettes* frame).

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- React Router (declarative routes)
- CSS Modules with design tokens in `src/styles/global.css`
- Inter (self-hosted via `@fontsource-variable/inter`)

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

This is a **demo**: there is no backend and all data is hard-coded in `src/data/mock.ts`. Changes you make (adding devices, archiving operators, …) live in memory and reset on page reload.

Sign in with **any** Operator ID and password. IDs starting with `OP-` sign in with the **operator** role (no Operators Profile / System Log pages); anything else signs in as **admin**. The operator authorization-code dialog accepts any 4–10 digit code.

## Screens

| Route | Screen |
| --- | --- |
| `/login` | Operator Login |
| `/forgot-password` → `/verify-code` → `/reset-password` | Password reset flow |
| `/map` | Device Monitoring — coverage map with geofences, relay towers, distress markers, and the Active Distress Signal panel |
| `/devices` | Device List — Distress Node / Relay Tower (battery) tabs, search, Add Device, Archive |
| `/devices/:deviceId` | Device and Profile Information — resident and device details, location, recent event logs; Edit Profile / Delete / Restore |
| `/history` | Distress History — delete to archive, restore from Archive |
| `/operators` | Operators Profile (admin) — create, edit, archive / restore operators, each confirmed with an authorization code |
| `/logs` | System Logs (admin) — audit trail; every action in the console is appended here |

## Project layout

```
src/
  assets/            Images and icons exported from Figma
  auth/              Session context (mock login) and route guards
  components/        Shared UI: layout, tables, pagination, modals, forms, map
  data/              Types, sample data and the in-memory data store
  hooks/             Table search/pagination and confirm/notice dialog helpers
  pages/             One file per screen (auth screens in pages/auth)
  styles/global.css  Design tokens and base styles
```

## Deploying

The site is published to **GitHub Pages** at https://octacore-technologies.github.io/Kalasag-Web/ by `.github/workflows/deploy-pages.yml` on every push to `main`. The workflow builds with `BASE_PATH=/Kalasag-Web/` and copies `index.html` to `404.html` so deep links survive a refresh.

One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

To host elsewhere, run `npm run build` (base `/`) and configure the host to serve `index.html` for unknown paths.
