// Sample records taken from the Figma screens. Replace with the Express API /
// Supabase data once the backend is wired up.
import type {
  ActiveSignal,
  Device,
  DeviceEvent,
  DistressRecord,
  MapMarker,
  Operator,
  RelayTower,
  SystemLog,
} from './types'

export const devices: Device[] = [
  {
    id: 'AU-082904',
    type: 'Distress Node',
    status: 'Active',
    location: 'Road 47 Dahlia Street',
    residentName: 'Joshua Dayapera',
    birthDate: '2004-08-29',
    address: 'Gloria Ville HOA Bahai Bukid Camarin II C.C.',
    phone: '924 254 3446',
    email: 'dayapera.joshuabscs2024@gmail.com',
    battery: '96% - 26 days',
    archived: false,
  },
  {
    id: 'AD-485673',
    type: 'Distress Node',
    status: 'Active',
    location: 'Bagong Silang Rd. 23',
    residentName: 'Jestine Ashley Aquino',
    birthDate: '2001-03-14',
    address: 'Bagong Silang Rd. 23, Caloocan City, Metro Manila Philippines, 1428',
    phone: '964 859 226',
    email: 'aquino.jestinebscs2024@gmail.com',
    battery: '81% - 22 days',
    archived: false,
  },
  {
    id: 'OS-234725',
    type: 'Distress Node',
    status: 'Inactive',
    location: 'Saranay Street Lora 16',
    residentName: 'Rodge Patrick Pangilinan',
    birthDate: '1998-12-05',
    address: 'No. 12 Dahlia St., Zone 2 Road 47, Hercules St. Brgy. 21, Camarin Caloocan City, Metro Manila Philippines, 1421',
    phone: '912 345 6789',
    email: 'panngilinan.rodgepatrickbscs2024@gmail.com',
    battery: '0%',
    archived: false,
  },
  {
    id: 'RT-234326',
    type: 'Relay Tower',
    status: 'Active',
    location: 'Road 47 Dahlia Street',
    residentName: '—',
    birthDate: '',
    address: 'Road 47 Dahlia Street, Camarin, Caloocan City',
    phone: '',
    email: '',
    battery: '96% - 26 days',
    archived: false,
  },
  {
    id: 'RT-456723',
    type: 'Relay Tower',
    status: 'Inactive',
    location: 'Bagong Silang Rd. 23',
    residentName: '—',
    birthDate: '',
    address: 'Bagong Silang Rd. 23, Caloocan City',
    phone: '',
    email: '',
    battery: '0%',
    archived: false,
  },
  {
    id: 'RT-234872',
    type: 'Relay Tower',
    status: 'Active',
    location: 'Saranay Street Lora 16',
    residentName: '—',
    birthDate: '',
    address: 'Saranay Street Lora 16, Caloocan City',
    phone: '',
    email: '',
    battery: '23% - 7 days',
    archived: false,
  },
]

/** "Recent Event Logs" on the device profile, newest first. */
export const deviceEvents: Record<string, DeviceEvent[]> = {
  'AU-082904': [
    { date: 'Oct 27, 2026', time: '10:38 PM', status: 'Trapped' },
    { date: 'Oct 25, 2026', time: '2:52 AM', status: 'Safe' },
    { date: 'Oct 18, 2026', time: '1:22 PM', status: 'Safe' },
    { date: 'Aug 28, 2026', time: '4:29 AM', status: 'Need Help' },
    { date: 'Aug 25, 2026', time: '3:35 PM', status: 'Safe' },
  ],
  'AD-485673': [
    { date: 'Oct 26, 2026', time: '9:14 PM', status: 'Need Help' },
    { date: 'Sep 30, 2026', time: '6:02 AM', status: 'Safe' },
  ],
  'OS-234725': [
    { date: 'Oct 27, 2026', time: '11:05 PM', status: 'Trapped' },
    { date: 'Oct 02, 2026', time: '7:48 PM', status: 'Safe' },
  ],
}

export const distressHistory: DistressRecord[] = [
  { id: 'DH-0001', deviceId: 'AU-082904', status: 'Safe', location: 'Road 47 Dahlia Street', residentName: 'Joshua Dayapera', archived: false },
  { id: 'DH-0002', deviceId: 'AD-485673', status: 'Need Help', location: 'Bagong Silang Rd. 23', residentName: 'Jestine Ashley Aquino', archived: false },
  { id: 'DH-0003', deviceId: 'OS-234725', status: 'Trapped', location: 'Saranay Street Lora 16', residentName: 'Rodge Patrick Pangilinan', archived: false },
]

export const activeSignals: ActiveSignal[] = [
  { id: 'SIG-1', residentName: 'Joshua Dayapera', status: 'Trapped', location: 'Gloria Ville HOA', markerId: 'm3' },
  { id: 'SIG-2', residentName: 'Rodge Patrick', status: 'Need Help', location: 'Camarin Mangga Street', markerId: 'm2' },
  { id: 'SIG-3', residentName: 'Nathaniel Tarroza', status: 'Safe', location: 'Dahlia Street Blk 29', markerId: 'm4' },
]

export const mapMarkers: MapMarker[] = [
  { id: 'm1', status: 'Trapped', label: 'OS-234725 · Trapped', x: 36.67, y: 59.38 },
  { id: 'm2', status: 'Need Help', label: 'Rodge Patrick · Need Help', x: 46.48, y: 64.25 },
  { id: 'm3', status: 'Trapped', label: 'Joshua Dayapera · Trapped', x: 57.71, y: 63.63 },
  { id: 'm4', status: 'Safe', label: 'Nathaniel Tarroza · Safe', x: 71.26, y: 67.88 },
  { id: 'm5', status: 'Need Help', label: 'AD-485673 · Need Help', x: 58.26, y: 75.63 },
]

export const relayTowers: RelayTower[] = [
  { id: 'RT-234326', x: 42.29, y: 61.25 },
  { id: 'RT-234872', x: 54.52, y: 65.63 },
  { id: 'RT-456723', x: 68.17, y: 66.13 },
]

/** Geofence coverage circles (top-left corner, % of the map frame). */
export const geofences = [
  { id: 'g1', x: 28.41, y: 46.5 },
  { id: 'g2', x: 40.42, y: 51.88 },
  { id: 'g3', x: 54.52, y: 51.25 },
]

export const operators: Operator[] = [
  { key: 'op-1', accountId: 'OP-9235', name: 'Dayapera, Joshua V.', email: 'dayapera.joshuabscs2024@gmail.com', contact: '+63 924 254 3446', dateRegistered: 'October 10, 2026', archived: false },
  { key: 'op-2', accountId: 'OP-1025', name: 'Tarroza, Nathaniel C.', email: 'tarroza.nathanielbscs2024@gmail.com', contact: '+63 9619356807', dateRegistered: 'October 10, 2026', archived: false },
  { key: 'op-3', accountId: 'OP-7854', name: 'Aquino, Jestine Ashley B.', email: 'aquino.jestinebscs2024@gmail.com', contact: '+63 964859226', dateRegistered: 'October 10, 2026', archived: false },
  { key: 'op-4', accountId: 'OP-2095', name: 'Pangilinan, Rodge Patrick E.', email: 'panngilinan.rodgepatrickbscs2024@gmail.com', contact: '+63 9619320543', dateRegistered: 'October 10, 2026', archived: false },
  { key: 'op-5', accountId: 'OP-9236', name: 'Delos Santos, Ashbey D.', email: 'delossantos.ashbeybscs2024@gmail.com', contact: '+63 9196458795', dateRegistered: 'October 10, 2026', archived: false },
  { key: 'op-6', accountId: 'OP-8956', name: 'Gonzal, Jael E.', email: 'gonzal.jaelbscs2024@gmail.com', contact: '+63 619375863', dateRegistered: 'October 10, 2026', archived: false },
  { key: 'op-7', accountId: 'OP-0985', name: 'Villareal, Jamin V.', email: 'villareal.jaminbscs2024@gmail.com', contact: '+63 637452819', dateRegistered: 'October 10, 2026', archived: false },
  { key: 'op-8', accountId: 'OP-9854', name: 'Seraspe, Ren E.', email: 'seraspe.renbscs2024@gmail.com', contact: '+63 689202341', dateRegistered: 'October 10, 2026', archived: false },
]

export const systemLogs: SystemLog[] = [
  { id: 'LOG-1', date: 'October 23, 2026', time: '8:23 AM', operator: 'Joshua Dayapera', actionType: 'System Login', description: 'User authenticated successfully' },
]
