export type Role = 'admin' | 'operator'

export type DeviceType = 'Distress Node' | 'Relay Tower'
export type DeviceStatus = 'Active' | 'Inactive'
export type DistressStatus = 'Trapped' | 'Need Help' | 'Safe'

export interface Device {
  id: string
  type: DeviceType
  status: DeviceStatus
  location: string
  residentName: string
  birthDate: string
  address: string
  phone: string
  email: string
  /** Battery percentage & estimated remaining life, as reported by the node. */
  battery: string
  archived: boolean
}

export interface DeviceEvent {
  date: string
  time: string
  status: DistressStatus
}

export interface DistressRecord {
  id: string
  deviceId: string
  status: DistressStatus
  location: string
  residentName: string
  archived: boolean
}

export interface ActiveSignal {
  id: string
  residentName: string
  status: DistressStatus
  location: string
  markerId: string
}

export interface MapMarker {
  id: string
  status: DistressStatus
  label: string
  /** Position as a percentage of the map frame (908 × 800 in Figma). */
  x: number
  y: number
}

export interface RelayTower {
  id: string
  x: number
  y: number
}

export interface Operator {
  key: string
  accountId: string
  name: string
  email: string
  contact: string
  dateRegistered: string
  archived: boolean
}

export interface SystemLog {
  id: string
  date: string
  time: string
  operator: string
  actionType: string
  description: string
}
