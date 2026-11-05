import { useMemo } from 'react'
import { Link } from 'react-router'
import eyeIcon from '../assets/icon-eye-sm.svg'
import { CoverageMap } from '../components/CoverageMap'
import { DataTable, type Column } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { Pagination } from '../components/Pagination'
import { StatusText } from '../components/StatusText'
import { useData } from '../data/DataContext'
import type { ActiveSignal } from '../data/types'
import { useTableState } from '../hooks/useTableState'
import listStyles from './ListPage.module.css'
import styles from './DashboardPage.module.css'

const searchText = (s: ActiveSignal) => s.residentName

export function DashboardPage() {
  const { ready, signals, markers, devices } = useData()
  const table = useTableState(signals, searchText, 15)
  const towers = useMemo(
    () =>
      devices
        .filter((d) => d.type === 'Relay Tower' && !d.archived && d.map)
        .map((d) => ({ id: d.id, x: d.map!.x, y: d.map!.y })),
    [devices],
  )

  /** The eye icon opens the same place as the signal's map marker. */
  const signalTarget = (s: ActiveSignal) => markers.find((m) => m.id === s.markerId)?.to ?? '/devices'

  const columns: Column<ActiveSignal>[] = [
    { key: 'name', header: 'Resident Name', weight: 155, render: (s) => s.residentName },
    { key: 'status', header: 'Status', weight: 135, render: (s) => <StatusText status={s.status} /> },
    { key: 'location', header: 'Location', weight: 230, render: (s) => s.location },
    {
      key: 'action',
      header: 'Action',
      weight: 110,
      render: (s) => (
        <Link to={signalTarget(s)} className={listStyles.iconButton} aria-label={`View ${s.residentName}`}>
          <img src={eyeIcon} alt="" width={18} height={12} />
        </Link>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <PageHeader
        title="Device Monitoring"
        description="Monitor registered devices, track mapped locations, and visualize geofence coverage zones to support real-time monitoring and distress response."
      />

      <section className={styles.content} aria-label="Coverage map and active distress signals">
        <div className={styles.mapArea}>
          <CoverageMap markers={markers} towers={towers} />
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Active Distress Signal</h2>
            <span className={styles.count} aria-label={`${signals.length} active signals`}>
              {signals.length}
            </span>
          </div>
          <DataTable
            caption="Active distress signals"
            size="sm"
            columns={columns}
            rows={table.pageRows}
            rowKey={(s) => s.id}
            emptyMessage={ready ? 'No active distress signals.' : 'Loading…'}
          />
          <Pagination
            className={styles.panelPagination}
            page={table.page}
            pageCount={table.pageCount}
            shown={table.pageRows.length}
            total={table.total}
            noun="active distress signal"
            onPageChange={table.setPage}
          />
        </div>
      </section>
    </div>
  )
}
