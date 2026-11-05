import { getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'

const env = import.meta.env

/**
 * Without a Firebase project configured (no VITE_FIREBASE_API_KEY), the app
 * talks to the local emulators under the offline-only "demo-kalasag" project.
 */
export const usingEmulators = env.VITE_USE_FIREBASE_EMULATORS === 'true' || !env.VITE_FIREBASE_API_KEY

// Hot reloads re-run this module; reuse the instances created the first time.
const existingApp = getApps()[0]

const app =
  existingApp ??
  initializeApp(
    usingEmulators
      ? { apiKey: 'demo-key', projectId: 'demo-kalasag', authDomain: 'demo-kalasag.firebaseapp.com', appId: 'demo-kalasag' }
      : {
          apiKey: env.VITE_FIREBASE_API_KEY,
          authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: env.VITE_FIREBASE_APP_ID,
        },
  )

// Offline-first: reads come from (and writes queue in) IndexedDB, shared across tabs,
// and sync with the server whenever a connection is available.
export const db = existingApp
  ? getFirestore(app)
  : initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      ignoreUndefinedProperties: true,
    })

// getAuth persists the signed-in user in IndexedDB, so a session survives offline reloads.
export const auth = getAuth(app)

if (usingEmulators && !existingApp) {
  const host = env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1'
  connectFirestoreEmulator(db, host, 8080)
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true })
}
