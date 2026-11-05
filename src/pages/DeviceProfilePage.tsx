import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import mapBase from '../assets/map-base.png'
import pin from '../assets/icon-location-pin.svg'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { DeviceFormModal } from '../components/DeviceFormModal'
import { PageHeader } from '../components/PageHeader'
import { StatusText } from '../components/StatusText'
import { useData, useDeviceEvents } from '../data/DataContext'
import { useDialogs } from '../hooks/useDialogs'
import styles from './DeviceProfilePage.module.css'

const TITLE = 'Device and Profile Information'
const DESCRIPTION =
  'View resident information, monitor device status and location, and review recent distress logs for effective safety monitoring and device management.'

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

function DetailSection({ title, rows }: { title: string; rows: [string, ReactNode][] }) {
  return (
    <section className={styles.half}>
      <h2 className={styles.halfTitle}>{title}</h2>
      <dl className={styles.rows}>
        {rows.map(([label, value]) => (
          <div key={label} className={styles.row}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function DeviceProfilePage() {
  const { deviceId } = useParams()
  const navigate = useNavigate()
  const { ready, devices, updateDevice, setDevicesArchived } = useData()
  const { confirm, notify, dialogElement } = useDialogs()
  const [editing, setEditing] = useState(false)
  const device = devices.find((d) => d.id === deviceId)
  const events = useDeviceEvents(device?.id)

  if (!device) {
    return (
      <div className={styles.page}>
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <section className={styles.card}>
          <p className={styles.missing}>
            {ready ? (
              <>
                Device <strong>{deviceId}</strong> was not found. <Link to="/devices">Back to Device List</Link>
              </>
            ) : (
              'Loading…'
            )}
          </p>
        </section>
      </div>
    )
  }

  const residentRows: [string, ReactNode][] = [
    ['Name', device.residentName],
    ['Date of Birth', device.birthDate ? dateFormat.format(new Date(device.birthDate)) : '—'],
    ['Pinpoint Location', device.address || '—'],
    ['Phone Number', device.phone ? `+63 ${device.phone}` : '—'],
    ['Email', device.email || '—'],
  ]
  const deviceRows: [string, ReactNode][] = [
    ['Device ID', device.id],
    ['Device Type', device.type],
    ['Status', <StatusText status={device.status} />],
    ['Battery Life', <StatusText status={device.status}>{device.battery}</StatusText>],
  ]

  const deleteDevice = () =>
    confirm({ title: 'Delete Device?', message: 'Are you sure you want to delete this device?' }, () => {
      setDevicesArchived([device.id], true)
      notify('Successfully Deleted!', 'The device has been deleted successfully.', () => navigate('/devices'))
    })

  const restoreDevice = () =>
    confirm({ title: 'Restore Device?', message: 'Are you sure you want to restore this device?' }, () => {
      setDevicesArchived([device.id], false)
      notify('Device Restored Successfully!', 'The device has been restored successfully.', () => navigate('/devices'))
    })

  return (
    <div className={styles.page}>
      <PageHeader title={TITLE} description={DESCRIPTION} />

      <section className={styles.card} aria-label={`${device.id} profile`}>
        <div className={styles.toolbar}>
          <BackButton onClick={() => navigate('/devices')} />
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          {device.archived ? (
            <Button variant="soft" onClick={restoreDevice}>
              Restore
            </Button>
          ) : (
            <Button variant="danger" onClick={deleteDevice}>
              Delete
            </Button>
          )}
        </div>

        <div className={styles.details}>
          <DetailSection title="Resident Personal Details" rows={residentRows} />
          <DetailSection title="Device Information" rows={deviceRows} />
        </div>

        <div className={styles.bottom}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Geographical Device Location</h2>
            <div className={styles.map}>
              <img src={mapBase} alt={`Map showing the location of ${device.id}`} className={styles.mapBase} />
              <img src={pin} alt="" width={18} height={22} className={styles.pin} />
            </div>
          </div>

          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Recent Event Logs</h2>
            {events.length === 0 ? (
              <p className={styles.empty}>No distress events recorded for this device.</p>
            ) : (
              <ul className={styles.events}>
                {events.map((e) => (
                  <li key={`${e.date}-${e.time}`} className={styles.event}>
                    <span>{e.date}</span>
                    <span>{e.time}</span>
                    <StatusText status={e.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {editing && (
        <DeviceFormModal
          device={device}
          onCancel={() => setEditing(false)}
          onSubmit={(input) =>
            confirm({ title: 'Edit Device?', message: 'Are you sure you want to change this info?' }, () => {
              updateDevice(device.id, input)
              setEditing(false)
              notify('Changes Saved Successfully!', 'Your changes have been saved successfully.')
            })
          }
        />
      )}

      {dialogElement}
    </div>
  )
}
