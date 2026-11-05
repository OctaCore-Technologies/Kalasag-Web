import type { ReactNode } from 'react'
import { statusColor } from '../data/status'
import type { DeviceStatus, DistressStatus } from '../data/types'

interface StatusTextProps {
  status: DeviceStatus | DistressStatus
  /** Text to show in the status color; defaults to the status itself. */
  children?: ReactNode
}

export function StatusText({ status, children }: StatusTextProps) {
  return <strong style={{ color: statusColor(status), fontWeight: 700 }}>{children ?? status}</strong>
}
