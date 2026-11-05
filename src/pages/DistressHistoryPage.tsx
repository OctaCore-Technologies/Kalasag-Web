import { useMemo, useState } from 'react'
import archiveIcon from '../assets/icon-archive.svg'
import restoreIcon from '../assets/icon-restore.svg'
import trashIcon from '../assets/icon-trash.svg'
import { BackButton } from '../components/BackButton'
import { Button } from '../components/Button'
import { DataTable, type Column } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { Pagination } from '../components/Pagination'
import { StatusText } from '../components/StatusText'
import { Toolbar } from '../components/Toolbar'
import { useData } from '../data/DataContext'
import type { DistressRecord } from '../data/types'
import { useDialogs } from '../hooks/useDialogs'
import { useTableState } from '../hooks/useTableState'
import styles from './ListPage.module.css'

const searchText = (h: DistressRecord) => [h.deviceId, h.status, h.location, h.residentName].join(' ')

export function DistressHistoryPage() {
  const { ready, history, setHistoryArchived } = useData()
  const { confirm, notify, dialogElement } = useDialogs()
  const [showArchive, setShowArchive] = useState(false)

  const rows = useMemo(() => history.filter((h) => h.archived === showArchive), [history, showArchive])
  const table = useTableState(rows, searchText)

  const deleteRecord = (record: DistressRecord) =>
    confirm({ title: 'Delete History?', message: 'Are you sure you want to delete this history?' }, () => {
      setHistoryArchived([record.id], true)
      notify('History Deleted Successfully!', 'The history record has been deleted successfully.')
    })

  const restoreRecord = (record: DistressRecord) =>
    confirm({ title: 'Restore Record?', message: 'Are you sure you want to restore this record?' }, () => {
      setHistoryArchived([record.id], false)
      notify('Record Restored Successfully!', 'The record has been restored successfully.')
    })

  const columns: Column<DistressRecord>[] = [
    { key: 'device', header: 'Device ID', weight: 254, render: (h) => h.deviceId },
    { key: 'status', header: 'Status', weight: 168, render: (h) => <StatusText status={h.status} /> },
    { key: 'location', header: 'Location', weight: 566, render: (h) => h.location },
    { key: 'resident', header: 'Resident Name', weight: 306, render: (h) => h.residentName },
    {
      key: 'action',
      header: 'Action',
      weight: 313,
      inset: 103,
      render: (h) =>
        showArchive ? (
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => restoreRecord(h)}
            aria-label={`Restore record for ${h.deviceId}`}
          >
            <img src={restoreIcon} alt="" width={25} height={25} />
          </button>
        ) : (
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => deleteRecord(h)}
            aria-label={`Delete record for ${h.deviceId}`}
          >
            <img src={trashIcon} alt="" width={25} height={25} />
          </button>
        ),
    },
  ]

  const toggleArchive = () => {
    setShowArchive((v) => !v)
    table.setSearch('')
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Distress History"
        description="A complete log of all received distress alerts, tracking each report's severity and room-level Spatial ID."
      />

      <Toolbar
        search={table.search}
        onSearchChange={table.setSearch}
        searchLabel="Search distress history"
        actions={
          showArchive ? (
            <BackButton onClick={toggleArchive} />
          ) : (
            <Button variant="neutral" icon={<img src={archiveIcon} alt="" width={18} height={18} />} onClick={toggleArchive}>
              Archive
            </Button>
          )
        }
      >
        {showArchive && <span className={styles.archiveNote}>Archived records</span>}
      </Toolbar>

      <DataTable
        caption={showArchive ? 'Archived distress records' : 'Distress history'}
        columns={columns}
        rows={table.pageRows}
        rowKey={(h) => h.id}
        emptyMessage={!ready ? 'Loading…' : showArchive ? 'No archived records.' : 'No distress records match your search.'}
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

      {dialogElement}
    </div>
  )
}
