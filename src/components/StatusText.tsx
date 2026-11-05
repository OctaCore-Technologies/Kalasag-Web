import type { DeviceStatus, DistressStatus } from '../data/types'

const COLORS: Record<DeviceStatus | DistressStatus, string> = {
  Active: 'var(--color-available)',
  Safe: 'var(--color-available)',
  'Need Help': 'var(--color-pending)',
  Inactive: 'var(--color-cancelled)',
  Trapped: 'var(--color-cancelled)',
}

export function StatusText({ status }: { status: DeviceStatus | DistressStatus }) {
  return <strong style={{ color: COLORS[status], fontWeight: 700 }}>{status}</strong>
}
