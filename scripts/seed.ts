// Loads the sample data and demo accounts into the Firebase emulators.
// Start them first with `npm run emulators`, then run `npm run seed`.
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import * as seed from '../src/data/seed.ts'
import { operatorEmail } from '../src/lib/operatorEmail.ts'

process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080'
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099'
// Not running on Google Cloud: skip the metadata-server probe (avoids a noisy warning).
process.env.METADATA_SERVER_DETECTION ??= 'none'

const projectId = 'demo-kalasag'
initializeApp({ projectId })
const db = getFirestore()
const auth = getAuth()

function timestamp(date: string, time: string) {
  const parsed = new Date(`${date} ${time}`)
  return Timestamp.fromDate(Number.isNaN(parsed.getTime()) ? new Date() : parsed)
}

async function seedUsers() {
  for (const user of seed.seedUsers) {
    const account = { email: operatorEmail(user.operatorId), password: user.password, displayName: user.name }
    try {
      await auth.updateUser(user.uid, account)
    } catch {
      await auth.createUser({ uid: user.uid, ...account })
    }
    await db.doc(`users/${user.uid}`).set({ operatorId: user.operatorId, name: user.name, role: user.role })
  }
}

async function seedCollections() {
  const batch = db.batch()

  for (const { id, ...device } of seed.devices) batch.set(db.doc(`devices/${id}`), device)
  for (const [deviceId, events] of Object.entries(seed.deviceEvents)) {
    events.forEach((event, i) =>
      batch.set(db.doc(`devices/${deviceId}/events/seed-${i}`), { ...event, createdAt: timestamp(event.date, event.time) }),
    )
  }
  for (const { id, ...record } of seed.distressHistory) batch.set(db.doc(`distressHistory/${id}`), record)
  for (const { id, ...signal } of seed.activeSignals) batch.set(db.doc(`signals/${id}`), signal)
  for (const { id, ...marker } of seed.mapMarkers) batch.set(db.doc(`mapMarkers/${id}`), marker)
  for (const { key, ...operator } of seed.operators) batch.set(db.doc(`operators/${key}`), operator)
  for (const { id, ...log } of seed.systemLogs) {
    batch.set(db.doc(`logs/${id}`), { ...log, createdAt: timestamp(log.date, log.time) })
  }

  await batch.commit()
}

await seedUsers()
await seedCollections()

console.log(`Seeded project "${projectId}" in the emulators.`)
for (const user of seed.seedUsers) {
  console.log(`  ${user.role.padEnd(8)} Operator ID ${user.operatorId}  password ${user.password}`)
}
