import type { DeviceStatus, DistressStatus } from './types'

const COLORS: Record<DeviceStatus | DistressStatus, string> = {
  Active: 'var(--color-available)',
  Safe: 'var(--color-available)',
  'Need Help': 'var(--color-pending)',
  Inactive: 'var(--color-cancelled)',
  Trapped: 'var(--color-cancelled)',
}

export function statusColor(status: DeviceStatus | DistressStatus) {
  return COLORS[status]
}
