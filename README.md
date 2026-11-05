# KALASAG Web Console

Operator console for **KALASAG** — a post-earthquake survivor distress network built on pre-configured LoRa nodes. Responders use it to watch the coverage map, track active distress signals, and manage devices, distress records, and operator accounts.

The UI is built from the Figma file [PRESENTATION – FINAL](https://www.figma.com/design/ELCeTJs6b2o0oWeYRnWCoh/PRESENTATION---FINAL?node-id=0-1) (Page 1 screens, colors and type from the *Typography & Palettes* frame).

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- React Router (declarative routes)
- CSS Modules with design tokens in `src/styles/global.css`
- Inter (self-hosted via `@fontsource-variable/inter`)
- **Firebase** — Firestore (with its persistent offline cache) and Firebase Auth
- **vite-plugin-pwa** — a service worker precaches the app so it opens without a connection

> `main` is the hard-coded demo published to GitHub Pages. This `implementation` branch is the offline-first Firebase version.

## Getting started

Needs Node 22+ and Java 21+ (for the Firestore emulator). Run each command in its own terminal:

```bash
npm install
npm run emulators   # Firebase Auth + Firestore emulators (UI at http://127.0.0.1:4000)
npm run seed        # load the sample data and demo accounts (re-run after restarting the emulators)
npm run dev         # http://localhost:5173
```

With no Firebase project configured the app talks to the emulators under the offline-only `demo-kalasag` project, so nothing touches the cloud.

Demo accounts created by `npm run seed` (emulator only):

| Operator ID | Password | Role |
| --- | --- | --- |
| `ADMIN-001` | `kalasag-admin` | admin — all pages |
| `OP-9235` | `kalasag-operator` | operator — Map, Device List, Distress History |

Other scripts: `npm run build` (type-check + production build), `npm run preview` (serve the build, including the service worker).

## Offline-first

- **Data:** Firestore runs with `persistentLocalCache` (IndexedDB, shared across tabs). Everything the console has loaded is readable offline, and edits apply instantly to the local cache, then sync when the server is reachable. The UI never waits on a write.
- **App shell:** the service worker precaches HTML, JS, CSS, fonts and images, so the console opens (including deep links) with no connection after the first visit.
- **Sign-in:** the first sign-in on a device needs a connection; after that the session is restored offline.
- A banner at the top of the console shows when you're offline or have changes waiting to sync.

## Connecting a real Firebase project

1. Create a project in the Firebase console, enable **Authentication → Email/Password** and **Firestore**.
2. Add a web app, then copy its config into `.env.local` (see `.env.example`).
3. Deploy the security rules: `npx firebase deploy --only firestore:rules --project <project-id>`.
4. Create console accounts in Authentication with the email `<operator-id>@kalasag.local` (e.g. `admin-001@kalasag.local`), and a matching `users/{uid}` document with `operatorId`, `name` and `role` (`admin` or `operator`).

## Not wired up yet

- **Forgot password** screens still only walk through the flow; Firebase's reset is link-based, so this needs a Cloud Function or a switch to email links.
- The **authorization-code** step for operator changes accepts any 4–10 digit code.
- **+ Add Operator** creates the operator record but not their sign-in account (that needs the Admin SDK, e.g. a Cloud Function).
- **Gateway uplink:** LoRa gateways don't write to Firestore yet; `signals`, `devices/{id}/events` and device battery are where uplinks should land.

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
  auth/              Firebase Auth session context and route guards
  components/        Shared UI: layout, tables, pagination, modals, forms, map
  data/              Types, Firestore-backed data store, seed data
  lib/               Firebase setup (offline cache, emulators)
  hooks/             Table search/pagination and confirm/notice dialog helpers
  pages/             One file per screen (auth screens in pages/auth)
  styles/global.css  Design tokens and base styles
scripts/seed.ts      Seeds the emulators (run with Node's built-in TypeScript support)
firestore.rules      Security rules (admins manage operators and read the audit log)
```

## Deploying

The site is published to **GitHub Pages** at https://octacore-technologies.github.io/Kalasag-Web/ by `.github/workflows/deploy-pages.yml` on every push to `main`. The workflow builds with `BASE_PATH=/Kalasag-Web/` and copies `index.html` to `404.html` so deep links survive a refresh.

One-time setup: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

To host elsewhere, run `npm run build` (base `/`) and configure the host to serve `index.html` for unknown paths.
