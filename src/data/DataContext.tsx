import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type DocumentData,
  type Query,
} from 'firebase/firestore'
import { useAuth } from '../auth/AuthContext'
import { db } from '../lib/firebase'
import type { ActiveSignal, Device, DeviceEvent, DistressRecord, MapMarker, Operator, SystemLog } from './types'

export type DeviceInput = Omit<Device, 'id' | 'status' | 'archived' | 'location' | 'battery' | 'map'> & { location?: string }
export type OperatorInput = Pick<Operator, 'name' | 'email' | 'contact'>

interface DataValue {
  /** True once every collection has delivered its first snapshot (from cache or server). */
  ready: boolean
  /** Local changes not yet acknowledged by the server (e.g. made while offline). */
  pendingWrites: boolean
  devices: Device[]
  history: DistressRecord[]
  operators: Operator[]
  logs: SystemLog[]
  signals: ActiveSignal[]
  markers: MapMarker[]
  addDevice: (input: DeviceInput) => Device
  updateDevice: (id: string, input: DeviceInput) => void
  setDevicesArchived: (ids: string[], archived: boolean) => void
  setHistoryArchived: (ids: string[], archived: boolean) => void
  addOperator: (input: OperatorInput) => Operator
  updateOperator: (key: string, input: OperatorInput) => void
  setOperatorsArchived: (keys: string[], archived: boolean) => void
  recordLog: (actionType: string, description: string, operator?: string) => Promise<void>
}

const DataContext = createContext<DataValue | null>(null)

const longDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const shortTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })

function randomDigits(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

function firstLine(address: string) {
  return address.split(',')[0]?.trim() || address
}

// Writes are never awaited by the UI: offline they resolve only after the next sync,
// but the local cache (and every listener) reflects them immediately.
function reportWriteError(error: unknown) {
  console.error('Firestore write failed', error)
}

type CollectionKey = 'devices' | 'history' | 'operators' | 'logs' | 'signals' | 'markers'

export function DataProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const [devices, setDevices] = useState<Device[]>([])
  const [history, setHistory] = useState<DistressRecord[]>([])
  const [operators, setOperators] = useState<Operator[]>([])
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [signals, setSignals] = useState<ActiveSignal[]>([])
  const [markers, setMarkers] = useState<MapMarker[]>([])
  const [loaded, setLoaded] = useState<Partial<Record<CollectionKey, boolean>>>({})
  const [pending, setPending] = useState<Partial<Record<CollectionKey, boolean>>>({})

  const uid = session?.uid
  const isAdmin = session?.role === 'admin'

  useEffect(() => {
    if (!uid) return

    function listen<T>(key: CollectionKey, source: Query<DocumentData>, idField: string, set: (rows: T[]) => void) {
      return onSnapshot(
        source,
        { includeMetadataChanges: true },
        (snap) => {
          set(snap.docs.map((d) => ({ ...d.data({ serverTimestamps: 'estimate' }), [idField]: d.id }) as T))
          setLoaded((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
          setPending((prev) =>
            prev[key] === snap.metadata.hasPendingWrites ? prev : { ...prev, [key]: snap.metadata.hasPendingWrites },
          )
        },
        (error) => console.error(`Listening to ${key} failed`, error),
      )
    }

    const unsubscribers = [
      listen<Device>('devices', collection(db, 'devices'), 'id', setDevices),
      listen<DistressRecord>('history', collection(db, 'distressHistory'), 'id', setHistory),
      listen<ActiveSignal>('signals', collection(db, 'signals'), 'id', setSignals),
      listen<MapMarker>('markers', collection(db, 'mapMarkers'), 'id', setMarkers),
    ]
    // Security rules only let admins read operator accounts and the audit log.
    if (isAdmin) {
      unsubscribers.push(
        listen<Operator>('operators', collection(db, 'operators'), 'key', setOperators),
        listen<SystemLog>('logs', query(collection(db, 'logs'), orderBy('createdAt', 'desc'), limit(500)), 'id', setLogs),
      )
    }

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      // Signed out (or role changed): drop the previous account's data from memory.
      ;[setDevices, setHistory, setSignals, setMarkers].forEach((clear) => clear([]))
      setOperators([])
      setLogs([])
      setLoaded({})
      setPending({})
    }
  }, [uid, isAdmin])

  const recordLog = useCallback(
    (actionType: string, description: string, operator?: string) => {
      const now = new Date()
      return addDoc(collection(db, 'logs'), {
        date: longDate.format(now),
        time: shortTime.format(now),
        operator: operator ?? session?.name ?? 'System',
        actionType,
        description,
        createdAt: serverTimestamp(),
      }).then(() => undefined, reportWriteError)
    },
    [session?.name],
  )

  const addDevice = useCallback(
    (input: DeviceInput) => {
      const prefix = input.type === 'Relay Tower' ? 'RT' : 'DN'
      const device: Device = {
        ...input,
        id: `${prefix}-${randomDigits(6)}`,
        status: 'Active',
        location: input.location || firstLine(input.address),
        battery: 'Awaiting first report',
        archived: false,
      }
      const { id, ...data } = device
      setDoc(doc(db, 'devices', id), data).catch(reportWriteError)
      recordLog('Device Added', `Registered ${device.type.toLowerCase()} ${id}`)
      return device
    },
    [recordLog],
  )

  const updateDevice = useCallback(
    (id: string, input: DeviceInput) => {
      updateDoc(doc(db, 'devices', id), { ...input, location: input.location || firstLine(input.address) }).catch(
        reportWriteError,
      )
      recordLog('Device Updated', `Updated device ${id}`)
    },
    [recordLog],
  )

  const setArchived = useCallback((path: string, ids: string[], archived: boolean) => {
    const batch = writeBatch(db)
    ids.forEach((id) => batch.update(doc(db, path, id), { archived }))
    batch.commit().catch(reportWriteError)
  }, [])

  const setDevicesArchived = useCallback(
    (ids: string[], archived: boolean) => {
      setArchived('devices', ids, archived)
      recordLog(archived ? 'Device Deleted' : 'Device Restored', `${archived ? 'Archived' : 'Restored'} ${ids.join(', ')}`)
    },
    [setArchived, recordLog],
  )

  const setHistoryArchived = useCallback(
    (ids: string[], archived: boolean) => {
      setArchived('distressHistory', ids, archived)
      recordLog(
        archived ? 'History Deleted' : 'History Restored',
        `${archived ? 'Archived' : 'Restored'} ${ids.length} distress record${ids.length === 1 ? '' : 's'}`,
      )
    },
    [setArchived, recordLog],
  )

  const addOperator = useCallback(
    (input: OperatorInput) => {
      const ref = doc(collection(db, 'operators'))
      const operator: Operator = {
        ...input,
        key: ref.id,
        accountId: `OP-${randomDigits(4)}`,
        dateRegistered: longDate.format(new Date()),
        archived: false,
      }
      const { key: _key, ...data } = operator
      setDoc(ref, data).catch(reportWriteError)
      recordLog('Operator Added', `Added operator ${operator.accountId}`)
      return operator
    },
    [recordLog],
  )

  const updateOperator = useCallback(
    (key: string, input: OperatorInput) => {
      updateDoc(doc(db, 'operators', key), { ...input }).catch(reportWriteError)
      recordLog('Operator Updated', `Updated operator ${input.name}`)
    },
    [recordLog],
  )

  const setOperatorsArchived = useCallback(
    (keys: string[], archived: boolean) => {
      setArchived('operators', keys, archived)
      recordLog(
        archived ? 'Operator Archived' : 'Operator Restored',
        `${archived ? 'Archived' : 'Restored'} ${keys.length} operator${keys.length === 1 ? '' : 's'}`,
      )
    },
    [setArchived, recordLog],
  )

  const expected: CollectionKey[] = isAdmin
    ? ['devices', 'history', 'signals', 'markers', 'operators', 'logs']
    : ['devices', 'history', 'signals', 'markers']
  const ready = expected.every((key) => loaded[key])
  const pendingWrites = Object.values(pending).some(Boolean)

  const value = useMemo(
    () => ({
      ready,
      pendingWrites,
      devices,
      history,
      operators,
      logs,
      signals,
      markers,
      addDevice,
      updateDevice,
      setDevicesArchived,
      setHistoryArchived,
      addOperator,
      updateOperator,
      setOperatorsArchived,
      recordLog,
    }),
    [
      ready,
      pendingWrites,
      devices,
      history,
      operators,
      logs,
      signals,
      markers,
      addDevice,
      updateDevice,
      setDevicesArchived,
      setHistoryArchived,
      addOperator,
      updateOperator,
      setOperatorsArchived,
      recordLog,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}

/** Latest distress events reported by one device (devices/{id}/events). */
export function useDeviceEvents(deviceId: string | undefined) {
  const [events, setEvents] = useState<DeviceEvent[]>([])

  useEffect(() => {
    if (!deviceId) return
    return onSnapshot(
      query(collection(db, 'devices', deviceId, 'events'), orderBy('createdAt', 'desc'), limit(5)),
      (snap) => setEvents(snap.docs.map((d) => d.data() as DeviceEvent)),
      (error) => console.error('Listening to device events failed', error),
    )
  }, [deviceId])

  return events
}
