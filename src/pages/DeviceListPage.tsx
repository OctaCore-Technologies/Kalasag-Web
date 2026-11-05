import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import archiveIcon from '../assets/icon-archive.svg'
import eyeIcon from '../assets/icon-eye.svg'
import { BackButton } from '../components/BackButton'
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

const searchText = (d: Device) => [d.id, d.status, d.location, d.residentName, d.battery].join(' ')

const DEVICE_LIST_DESCRIPTION =
  'Monitor registered devices, review their status and assigned locations, access resident profiles, and manage device records to ensure accurate and efficient system monitoring.'

export function DeviceListPage() {
  const { ready, devices, addDevice } = useData()
  const navigate = useNavigate()
  const { confirm, notify, dialogElement } = useDialogs()
  // The tab lives in the URL so map relay towers can link straight to /devices?tab=relay.
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: DeviceType = searchParams.get('tab') === 'relay' ? 'Relay Tower' : 'Distress Node'
  const setTab = (next: DeviceType) => setSearchParams(next === 'Relay Tower' ? { tab: 'relay' } : {}, { replace: true })
  const [showArchive, setShowArchive] = useState(false)
  const [adding, setAdding] = useState(false)

  const rows = useMemo(
    () => devices.filter((d) => d.archived === showArchive && (showArchive || d.type === tab)),
    [devices, tab, showArchive],
  )
  const table = useTableState(rows, searchText)

  const idColumn: Column<Device> = { key: 'id', header: 'Device ID', weight: 254, render: (d) => d.id }
  const statusColumn: Column<Device> = { key: 'status', header: 'Status', weight: 168, render: (d) => <StatusText status={d.status} /> }
  const locationColumn: Column<Device> = { key: 'location', header: 'Location', weight: 566, render: (d) => d.location }

  const nodeColumns: Column<Device>[] = [
    idColumn,
    statusColumn,
    locationColumn,
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

  const relayColumns: Column<Device>[] = [
    idColumn,
    statusColumn,
    locationColumn,
    {
      key: 'battery',
      header: 'Battery Percentage & Estimated Remaining Life',
      weight: 514,
      render: (d) => <StatusText status={d.status}>{d.battery}</StatusText>,
    },
    { key: 'spacer', header: '', weight: 105, render: () => null },
  ]

  const toggleArchive = () => {
    setShowArchive((v) => !v)
    table.setSearch('')
  }

  return (
    <div className={styles.page}>
      <PageHeader title="Device List" description={DEVICE_LIST_DESCRIPTION} />

      <Toolbar
        search={table.search}
        onSearchChange={table.setSearch}
        searchLabel="Search devices"
        actions={
          showArchive ? (
            <BackButton onClick={toggleArchive} />
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
        {showArchive ? (
          <span className={styles.archiveNote}>Archived devices</span>
        ) : (
          <Tabs label="Device type" tabs={TABS} value={tab} onChange={setTab} />
        )}
      </Toolbar>

      <DataTable
        caption={showArchive ? 'Archived devices' : `${tab} devices`}
        columns={!showArchive && tab === 'Relay Tower' ? relayColumns : nodeColumns}
        rows={table.pageRows}
        rowKey={(d) => d.id}
        emptyMessage={!ready ? 'Loading…' : showArchive ? 'No archived devices.' : 'No devices match your search.'}
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
            confirm({ title: 'Add Device?', message: 'Are you sure you want to add this device?' }, () => {
              const device = addDevice(input)
              setAdding(false)
              setTab(device.type)
              notify('Successfully Added!', 'The new device has been added successfully.')
            })
          }
        />
      )}

      {dialogElement}
    </div>
  )
}
