import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import archiveIcon from '../assets/icon-archive.svg'
import eyeIcon from '../assets/icon-eye.svg'
import { Button } from '../components/Button'
import { DataTable, type Column } from '../components/DataTable'
import { DeviceFormModal } from '../components/DeviceFormModal'
import { PageHeader } from '../components/PageHeader'
import { Pagination } from '../components/Pagination'
import { StatusText } from '../components/StatusText'
import { Tabs, Toolbar } from '../components/Toolbar'
import { useData } from '../data/DataContext'
import type { Device, DeviceType } from '../data/types'
import { useDialogs } from '../hooks/useDialogs'
import { useTableState } from '../hooks/useTableState'
import styles from './ListPage.module.css'

const TABS = ['Distress Node', 'Relay Tower'] as const

const searchText = (d: Device) => [d.id, d.status, d.location, d.residentName].join(' ')

export const DEVICE_LIST_DESCRIPTION =
  'Monitor registered devices, review their status and assigned locations, access resident profiles, and manage device records to ensure accurate and efficient system monitoring.'

export function DeviceListPage() {
  const { devices, addDevice, setDevicesArchived } = useData()
  const navigate = useNavigate()
  const { confirm, notify, dialogElement } = useDialogs()
  const [tab, setTab] = useState<DeviceType>('Distress Node')
  const [showArchive, setShowArchive] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [adding, setAdding] = useState(false)

  const rows = useMemo(
    () => devices.filter((d) => d.type === tab && d.archived === showArchive),
    [devices, tab, showArchive],
  )
  const table = useTableState(rows, searchText)

  const columns: Column<Device>[] = [
    { key: 'id', header: 'Device ID', weight: 254, render: (d) => d.id },
    { key: 'status', header: 'Status', weight: 168, render: (d) => <StatusText status={d.status} /> },
    { key: 'location', header: 'Location', weight: 566, render: (d) => d.location },
    { key: 'resident', header: 'Resident Name', weight: 306, render: (d) => d.residentName },
    {
      key: 'action',
      header: 'Action',
      weight: 313,
      inset: 103,
      render: (d) => (
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => navigate(`/devices/${d.id}`)}
          aria-label={`View ${d.id}`}
        >
          <img src={eyeIcon} alt="" width={24} height={16} />
        </button>
      ),
    },
  ]

  const toggleArchive = () => {
    setShowArchive((v) => !v)
    setSelected(new Set())
    table.setSearch('')
  }

  const restoreSelected = () =>
    confirm(
      {
        title: 'Restore selected devices?',
        message: `${selected.size} device${selected.size === 1 ? '' : 's'} will be moved back to the device list.`,
        confirmLabel: 'Restore',
      },
      () => {
        setDevicesArchived([...selected], false)
        setSelected(new Set())
        notify('Device Restored', 'The selected devices are back in the device list.')
      },
    )

  return (
    <div className={styles.page}>
      <PageHeader title="Device List" description={DEVICE_LIST_DESCRIPTION} />

      <Toolbar
        search={table.search}
        onSearchChange={table.setSearch}
        searchLabel="Search devices"
        actions={
          showArchive ? (
            <>
              <Button variant="neutral" onClick={toggleArchive}>
                Back
              </Button>
              <Button onClick={restoreSelected} disabled={selected.size === 0}>
                Restore
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setAdding(true)}>+ Add Device</Button>
              <Button variant="neutral" icon={<img src={archiveIcon} alt="" width={18} height={18} />} onClick={toggleArchive}>
                Archive
              </Button>
            </>
          )
        }
      >
        <Tabs
          label="Device type"
          tabs={TABS}
          value={tab}
          onChange={(next) => {
            setTab(next)
            setSelected(new Set())
          }}
        />
        {showArchive && <span className={styles.archiveNote}>Archived devices</span>}
      </Toolbar>

      <DataTable
        caption={showArchive ? 'Archived devices' : `${tab} devices`}
        columns={columns}
        rows={table.pageRows}
        rowKey={(d) => d.id}
        selection={showArchive ? { selected, onChange: setSelected } : undefined}
        emptyMessage={showArchive ? 'No archived devices.' : 'No devices match your search.'}
      />

      <Pagination
        className={styles.pagination}
        page={table.page}
        pageCount={table.pageCount}
        shown={table.pageRows.length}
        total={table.total}
        noun="units"
        onPageChange={table.setPage}
      />

      {adding && (
        <DeviceFormModal
          onCancel={() => setAdding(false)}
          onSubmit={(input) =>
            confirm(
              { title: 'Add this device?', message: 'The device will be registered and start reporting to the mesh.' },
              () => {
                const device = addDevice(input)
                setAdding(false)
                setTab(device.type)
                notify('Device Added', `${device.id} has been registered successfully.`)
              },
            )
          }
        />
      )}

      {dialogElement}
    </div>
  )
}
