import { useMemo, useState } from 'react'
import archiveIcon from '../assets/icon-archive.svg'
import trashIcon from '../assets/icon-trash.svg'
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
  const { history, setHistoryArchived } = useData()
  const { confirm, notify, dialogElement } = useDialogs()
  const [showArchive, setShowArchive] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const rows = useMemo(() => history.filter((h) => h.archived === showArchive), [history, showArchive])
  const table = useTableState(rows, searchText)

  const deleteRecord = (record: DistressRecord) =>
    confirm(
      {
        title: 'Delete this record?',
        message: `The distress record for ${record.deviceId} will be moved to the archive.`,
        confirmLabel: 'Delete',
      },
      () => {
        setHistoryArchived([record.id], true)
        notify('History Deleted', 'The distress record has been moved to the archive.')
      },
    )

  const restoreSelected = () =>
    confirm(
      {
        title: 'Restore selected records?',
        message: `${selected.size} record${selected.size === 1 ? '' : 's'} will be moved back to the distress history.`,
        confirmLabel: 'Restore',
      },
      () => {
        setHistoryArchived([...selected], false)
        setSelected(new Set())
        notify('History Restored', 'The selected records are back in the distress history.')
      },
    )

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
          '—'
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
    setSelected(new Set())
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
            <>
              <Button variant="neutral" onClick={toggleArchive}>
                Back
              </Button>
              <Button onClick={restoreSelected} disabled={selected.size === 0}>
                Restore
              </Button>
            </>
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
        selection={showArchive ? { selected, onChange: setSelected } : undefined}
        emptyMessage={showArchive ? 'No archived records.' : 'No distress records match your search.'}
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
