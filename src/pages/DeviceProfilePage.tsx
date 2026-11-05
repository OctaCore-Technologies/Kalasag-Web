import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Button } from '../components/Button'
import { DataTable, type Column } from '../components/DataTable'
import { DeviceFormModal } from '../components/DeviceFormModal'
import { PageHeader } from '../components/PageHeader'
import { PinpointMap } from '../components/PinpointMap'
import { StatusText } from '../components/StatusText'
import { useData } from '../data/DataContext'
import type { DistressRecord } from '../data/types'
import { useDialogs } from '../hooks/useDialogs'
import { DEVICE_LIST_DESCRIPTION } from './DeviceListPage'
import listStyles from './ListPage.module.css'
import styles from './DeviceProfilePage.module.css'

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

const historyColumns: Column<DistressRecord>[] = [
  { key: 'id', header: 'Record', weight: 1, render: (h) => h.id },
  { key: 'status', header: 'Status', weight: 1, render: (h) => <StatusText status={h.status} /> },
  { key: 'location', header: 'Location', weight: 1.6, render: (h) => h.location },
]

export function DeviceProfilePage() {
  const { deviceId } = useParams()
  const navigate = useNavigate()
  const { devices, history, updateDevice, setDevicesArchived } = useData()
  const { confirm, notify, dialogElement } = useDialogs()
  const [editing, setEditing] = useState(false)
  const device = devices.find((d) => d.id === deviceId)

  if (!device) {
    return (
      <div className={listStyles.page}>
        <PageHeader title="Device List" description={DEVICE_LIST_DESCRIPTION} />
        <section className={styles.card}>
          <p className={styles.missing}>
            Device <strong>{deviceId}</strong> was not found. <Link to="/devices">Back to Device List</Link>
          </p>
        </section>
      </div>
    )
  }

  const deviceHistory = history.filter((h) => h.deviceId === device.id && !h.archived)
  const details: [string, string][] = [
    ['Resident Name', device.residentName],
    ['Date of Birth', device.birthDate ? dateFormat.format(new Date(device.birthDate)) : '—'],
    ['Phone Number', device.phone ? `+63 ${device.phone}` : '—'],
    ['Email Address', device.email || '—'],
    ['Device Type', device.type],
    ['Location', device.location],
    ['Pinpoint Address', device.address || '—'],
  ]

  const deleteDevice = () =>
    confirm(
      {
        title: 'Delete this device?',
        message: `${device.id} will be moved to the archive. You can restore it from Device List › Archive.`,
        confirmLabel: 'Delete',
      },
      () => {
        setDevicesArchived([device.id], true)
        notify('Device Deleted', `${device.id} has been moved to the archive.`, () => navigate('/devices'))
      },
    )

  return (
    <div className={listStyles.page}>
      <PageHeader title="Device List" description={DEVICE_LIST_DESCRIPTION} />

      <section className={styles.card} aria-labelledby="device-profile-title">
        <div className={styles.toolbar}>
          <Link to="/devices" className={styles.back}>
            ← Back to Device List
          </Link>
          <h2 id="device-profile-title" className={styles.title}>
            {device.id} <StatusText status={device.status} />
          </h2>
          <div className={styles.actions}>
            <Button variant="soft" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
            <Button variant="danger" onClick={deleteDevice} disabled={device.archived}>
              Delete
            </Button>
          </div>
        </div>

        <dl className={styles.details}>
          {details.map(([label, value]) => (
            <div key={label} className={styles.detail}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.bottom}>
          <div className={styles.history}>
            <h3 className={styles.panelTitle}>Distress History</h3>
            <DataTable
              caption={`Distress history for ${device.id}`}
              size="sm"
              columns={historyColumns}
              rows={deviceHistory}
              rowKey={(h) => h.id}
              emptyMessage="No distress signals recorded for this device."
            />
          </div>
          <PinpointMap title="Device Location" className={styles.map} />
        </div>
      </section>

      {editing && (
        <DeviceFormModal
          device={device}
          onCancel={() => setEditing(false)}
          onSubmit={(input) =>
            confirm({ title: 'Save changes?', message: `Update the profile of ${device.id}.`, confirmLabel: 'Save' }, () => {
              updateDevice(device.id, input)
              setEditing(false)
              notify('Changes Saved', 'The device profile has been updated.')
            })
          }
        />
      )}

      {dialogElement}
    </div>
  )
}
