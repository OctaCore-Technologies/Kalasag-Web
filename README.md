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

Sign in with **any** Operator ID and password — authentication is mocked until the backend exists. IDs starting with `OP-` sign in with the **operator** role (no Operators Profile / System Log pages); anything else signs in as **admin**.

## Screens

| Route | Screen |
| --- | --- |
| `/login` | Operator Login |
| `/forgot-password` → `/verify-code` → `/reset-password` | Password reset flow |
| `/map` | Device Monitoring — coverage map with geofences, relay towers, distress markers, and the Active Distress Signal panel |
| `/devices` | Device List — Distress Node / Relay Tower tabs, search, Add Device, Archive / Restore |
| `/devices/:deviceId` | Device profile — details, distress history, location; Edit Profile / Delete |
| `/history` | Distress History — delete to archive, Archive / Restore |
| `/operators` | Operators Profile (admin) — add, edit, archive / restore operators |
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

## Wiring up the backend

The system flow in Figma has field devices uplink through MQTT/HTTP to an **Express API** that persists to **Supabase**. Until that exists:

- `src/auth/AuthContext.tsx` — `login()` accepts any credentials. Replace it with the API call.
- `src/data/DataContext.tsx` — holds devices, distress history, operators, and logs in React state, seeded from `src/data/mock.ts`. The data resets on a full page reload. Swap the setters for API calls (or Supabase queries) without changing the pages.
- The password-reset screens validate input and move through the flow but do not send email yet.
- The coverage map is the static map image from the design, with overlays positioned in percentages. Swap `CoverageMap` for a live map (e.g. Leaflet) once node coordinates come from the API.

## Deploying

This is a single-page app using browser history routing, so the host must serve `index.html` for unknown paths (a rewrite rule on Vercel, Netlify, Cloudflare Pages, etc.).
