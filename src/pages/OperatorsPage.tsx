import { useMemo, useState } from 'react'
import archiveIcon from '../assets/icon-archive.svg'
import archiveBoxIcon from '../assets/icon-archive-box.svg'
import editIcon from '../assets/icon-edit.svg'
import { Button } from '../components/Button'
import { DataTable, type Column } from '../components/DataTable'
import { OperatorFormModal } from '../components/OperatorFormModal'
import { PageHeader } from '../components/PageHeader'
import { Pagination } from '../components/Pagination'
import { Toolbar } from '../components/Toolbar'
import { useData } from '../data/DataContext'
import type { Operator } from '../data/types'
import { useDialogs } from '../hooks/useDialogs'
import { useTableState } from '../hooks/useTableState'
import styles from './ListPage.module.css'

const searchText = (o: Operator) => [o.accountId, o.name, o.email, o.contact, o.dateRegistered].join(' ')

export function OperatorsPage() {
  const { operators, addOperator, updateOperator, setOperatorsArchived } = useData()
  const { confirm, notify, dialogElement } = useDialogs()
  const [showArchive, setShowArchive] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<Operator | 'new' | null>(null)

  const rows = useMemo(() => operators.filter((o) => o.archived === showArchive), [operators, showArchive])
  const table = useTableState(rows, searchText)

  const archiveOperator = (operator: Operator) =>
    confirm(
      {
        title: 'Archive this operator?',
        message: `${operator.name} will lose access to the console until restored.`,
        confirmLabel: 'Archive',
      },
      () => {
        setOperatorsArchived([operator.key], true)
        notify('Operator Archived', `${operator.accountId} has been moved to the archive.`)
      },
    )

  const restoreSelected = () =>
    confirm(
      {
        title: 'Restore selected operators?',
        message: `${selected.size} operator${selected.size === 1 ? '' : 's'} will regain access to the console.`,
        confirmLabel: 'Restore',
      },
      () => {
        setOperatorsArchived([...selected], false)
        setSelected(new Set())
        notify('Operator Restored', 'The selected operators have been restored.')
      },
    )

  const columns: Column<Operator>[] = [
    { key: 'id', header: 'Account ID', weight: 194, align: 'left', tone: 'regular', render: (o) => o.accountId },
    { key: 'name', header: 'Name', weight: 308, align: 'left', tone: 'regular', render: (o) => o.name },
    { key: 'email', header: 'Email', weight: 438, align: 'left', tone: 'regular', render: (o) => o.email },
    { key: 'contact', header: 'Contact Number', weight: 269, align: 'left', tone: 'regular', render: (o) => o.contact },
    { key: 'date', header: 'Date Registered', weight: 212, align: 'left', render: (o) => o.dateRegistered },
    {
      key: 'action',
      header: 'Action',
      weight: 105,
      align: 'left',
      render: (o) =>
        showArchive ? (
          '—'
        ) : (
          <span className={styles.iconActions}>
            <button type="button" className={styles.iconButton} onClick={() => setEditing(o)} aria-label={`Edit ${o.name}`}>
              <img src={editIcon} alt="" width={31} height={31} />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => archiveOperator(o)}
              aria-label={`Archive ${o.name}`}
            >
              <img src={archiveBoxIcon} alt="" width={26} height={25} />
            </button>
          </span>
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
        title="Operators Profile"
        description="Manage operator accounts, update their contact details, and control who can access the Kalasag console."
      />

      <Toolbar
        search={table.search}
        onSearchChange={table.setSearch}
        searchLabel="Search operators"
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
              <Button onClick={() => setEditing('new')}>+ Add Operator</Button>
              <Button variant="neutral" icon={<img src={archiveIcon} alt="" width={18} height={18} />} onClick={toggleArchive}>
                Archive
              </Button>
            </>
          )
        }
      >
        {showArchive && <span className={styles.archiveNote}>Archived operators</span>}
      </Toolbar>

      <DataTable
        caption={showArchive ? 'Archived operators' : 'Operators'}
        columns={columns}
        rows={table.pageRows}
        rowKey={(o) => o.key}
        gutter
        selection={showArchive ? { selected, onChange: setSelected } : undefined}
        emptyMessage={showArchive ? 'No archived operators.' : 'No operators match your search.'}
      />

      <Pagination
        className={styles.pagination}
        page={table.page}
        pageCount={table.pageCount}
        shown={table.pageRows.length}
        total={table.total}
        noun="operators"
        onPageChange={table.setPage}
      />

      {editing && (
        <OperatorFormModal
          operator={editing === 'new' ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSubmit={(input) => {
            if (editing === 'new') {
              confirm({ title: 'Add this operator?', message: `${input.name} will be able to sign in to the console.` }, () => {
                const operator = addOperator(input)
                setEditing(null)
                notify('Operator Added', `${operator.accountId} has been registered successfully.`)
              })
            } else {
              confirm({ title: 'Save changes?', message: `Update the profile of ${editing.accountId}.`, confirmLabel: 'Save' }, () => {
                updateOperator(editing.key, input)
                setEditing(null)
                notify('Changes Saved', 'The operator profile has been updated.')
              })
            }
          }}
        />
      )}

      {dialogElement}
    </div>
  )
}
