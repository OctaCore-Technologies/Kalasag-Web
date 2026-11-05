import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import * as seed from './mock'
import type { Device, DistressRecord, Operator, SystemLog } from './types'

export type DeviceInput = Omit<Device, 'id' | 'status' | 'archived' | 'location' | 'battery'> & { location?: string }
export type OperatorInput = Pick<Operator, 'name' | 'email' | 'contact'>

interface DataValue {
  devices: Device[]
  history: DistressRecord[]
  operators: Operator[]
  logs: SystemLog[]
  addDevice: (input: DeviceInput) => Device
  updateDevice: (id: string, input: DeviceInput) => void
  setDevicesArchived: (ids: string[], archived: boolean) => void
  setHistoryArchived: (ids: string[], archived: boolean) => void
  addOperator: (input: OperatorInput) => Operator
  updateOperator: (key: string, input: OperatorInput) => void
  setOperatorsArchived: (keys: string[], archived: boolean) => void
  recordLog: (actionType: string, description: string, operator?: string) => void
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

export function DataProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const [devices, setDevices] = useState(seed.devices)
  const [history, setHistory] = useState(seed.distressHistory)
  const [operators, setOperators] = useState(seed.operators)
  const [logs, setLogs] = useState(seed.systemLogs)

  const recordLog = useCallback(
    (actionType: string, description: string, operator?: string) => {
      const now = new Date()
      setLogs((prev) => [
        {
          id: `LOG-${now.getTime()}-${randomDigits(3)}`,
          date: longDate.format(now),
          time: shortTime.format(now),
          operator: operator ?? session?.name ?? 'System',
          actionType,
          description,
        },
        ...prev,
      ])
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
      setDevices((prev) => [...prev, device])
      recordLog('Device Added', `Registered ${device.type.toLowerCase()} ${device.id}`)
      return device
    },
    [recordLog],
  )

  const updateDevice = useCallback(
    (id: string, input: DeviceInput) => {
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...input, location: input.location || firstLine(input.address) } : d)),
      )
      recordLog('Device Updated', `Updated device ${id}`)
    },
    [recordLog],
  )

  const setDevicesArchived = useCallback(
    (ids: string[], archived: boolean) => {
      setDevices((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, archived } : d)))
      recordLog(archived ? 'Device Deleted' : 'Device Restored', `${archived ? 'Archived' : 'Restored'} ${ids.join(', ')}`)
    },
    [recordLog],
  )

  const setHistoryArchived = useCallback(
    (ids: string[], archived: boolean) => {
      setHistory((prev) => prev.map((h) => (ids.includes(h.id) ? { ...h, archived } : h)))
      recordLog(
        archived ? 'History Deleted' : 'History Restored',
        `${archived ? 'Archived' : 'Restored'} ${ids.length} distress record${ids.length === 1 ? '' : 's'}`,
      )
    },
    [recordLog],
  )

  const addOperator = useCallback(
    (input: OperatorInput) => {
      const operator: Operator = {
        ...input,
        key: `op-${Date.now()}`,
        accountId: `OP-${randomDigits(4)}`,
        dateRegistered: longDate.format(new Date()),
        archived: false,
      }
      setOperators((prev) => [...prev, operator])
      recordLog('Operator Added', `Added operator ${operator.accountId}`)
      return operator
    },
    [recordLog],
  )

  const updateOperator = useCallback(
    (key: string, input: OperatorInput) => {
      setOperators((prev) => prev.map((o) => (o.key === key ? { ...o, ...input } : o)))
      recordLog('Operator Updated', `Updated operator ${input.name}`)
    },
    [recordLog],
  )

  const setOperatorsArchived = useCallback(
    (keys: string[], archived: boolean) => {
      setOperators((prev) => prev.map((o) => (keys.includes(o.key) ? { ...o, archived } : o)))
      recordLog(
        archived ? 'Operator Archived' : 'Operator Restored',
        `${archived ? 'Archived' : 'Restored'} ${keys.length} operator${keys.length === 1 ? '' : 's'}`,
      )
    },
    [recordLog],
  )

  const value = useMemo(
    () => ({
      devices,
      history,
      operators,
      logs,
      addDevice,
      updateDevice,
      setDevicesArchived,
      setHistoryArchived,
      addOperator,
      updateOperator,
      setOperatorsArchived,
      recordLog,
    }),
    [devices, history, operators, logs, addDevice, updateDevice, setDevicesArchived, setHistoryArchived, addOperator, updateOperator, setOperatorsArchived, recordLog],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
