import { DataTable, type Column } from '../components/DataTable'
import { PageHeader } from '../components/PageHeader'
import { Pagination } from '../components/Pagination'
import { Toolbar } from '../components/Toolbar'
import { useData } from '../data/DataContext'
import type { SystemLog } from '../data/types'
import { useTableState } from '../hooks/useTableState'
import styles from './ListPage.module.css'

const searchText = (l: SystemLog) => [l.date, l.time, l.operator, l.actionType, l.description].join(' ')

const columns: Column<SystemLog>[] = [
  { key: 'date', header: 'Date', weight: 217, align: 'left', tone: 'regular', render: (l) => l.date },
  { key: 'time', header: 'Time', weight: 206, align: 'left', tone: 'regular', render: (l) => l.time },
  { key: 'operator', header: 'Operator', weight: 315, align: 'left', tone: 'regular', render: (l) => l.operator },
  { key: 'type', header: 'Action Type', weight: 311, align: 'left', tone: 'regular', render: (l) => l.actionType },
  { key: 'description', header: 'Description', weight: 477, align: 'left', tone: 'regular', render: (l) => l.description },
]

export function SystemLogsPage() {
  const { logs } = useData()
  const table = useTableState(logs, searchText)

  return (
    <div className={styles.page}>
      <PageHeader
        title="System Logs"
        description="An audit trail of operator sign-ins and every change made to devices, distress records, and operator accounts."
      />

      <Toolbar search={table.search} onSearchChange={table.setSearch} searchLabel="Search system logs" />

      <DataTable
        caption="System logs"
        columns={columns}
        rows={table.pageRows}
        rowKey={(l) => l.id}
        gutter
        emptyMessage="No log entries match your search."
      />

      <Pagination
        className={styles.pagination}
        page={table.page}
        pageCount={table.pageCount}
        shown={table.pageRows.length}
        total={table.total}
        noun="entries"
        onPageChange={table.setPage}
      />
    </div>
  )
}
