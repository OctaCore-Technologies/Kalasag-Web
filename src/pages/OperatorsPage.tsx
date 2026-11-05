import { useMemo, useState } from 'react'
import archiveIcon from '../assets/icon-archive.svg'
import archiveBoxIcon from '../assets/icon-archive-box.svg'
import editIcon from '../assets/icon-edit.svg'
import { BackButton } from '../components/BackButton'
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

const idColumn: Column<Operator> = { key: 'id', header: 'Account ID', weight: 194, align: 'left', tone: 'regular', render: (o) => o.accountId }
const nameColumn: Column<Operator> = { key: 'name', header: 'Name', weight: 308, align: 'left', tone: 'regular', render: (o) => o.name }
const contactColumn: Column<Operator> = { key: 'contact', header: 'Contact Number', weight: 269, align: 'left', tone: 'regular', render: (o) => o.contact }

/** Archive view drops the Action column, so Email and Date Registered widen (per the "Operators Profile 1" frame). */
const archiveColumns: Column<Operator>[] = [
  idColumn,
  nameColumn,
  { key: 'email', header: 'Email', weight: 501, align: 'left', tone: 'regular', render: (o) => o.email },
  contactColumn,
  { key: 'date', header: 'Date Registered', weight: 254, align: 'left', render: (o) => o.dateRegistered },
]

export function OperatorsPage() {
  const { ready, operators, addOperator, updateOperator, setOperatorsArchived } = useData()
  const { confirm, authorize, notify, dialogElement } = useDialogs()
  const [showArchive, setShowArchive] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<Operator | 'new' | null>(null)

  const rows = useMemo(() => operators.filter((o) => o.archived === showArchive), [operators, showArchive])
  const table = useTableState(rows, searchText)

  // Every operator-account change is confirmed, then authorized with the Administrator's code.
  const confirmAndAuthorize = (spec: { title: string; message: string }, action: () => void) =>
    confirm(spec, () => authorize(action))

  const archiveOperator = (operator: Operator) =>
    confirmAndAuthorize({ title: 'Archive Operator?', message: 'Are you sure you want to archive this operator?' }, () => {
      setOperatorsArchived([operator.key], true)
      notify('Successfully Archived!', 'The operator has been archived successfully.')
    })

  const restoreSelected = () =>
    confirmAndAuthorize(
      { title: 'Recover Operator Account?', message: 'Are you sure you want to restore this operator account?' },
      () => {
        setOperatorsArchived([...selected], false)
        setSelected(new Set())
        notify('Operator Restored Successfully!', 'The operator account has been restored successfully.')
      },
    )

  const activeColumns: Column<Operator>[] = [
    idColumn,
    nameColumn,
    { key: 'email', header: 'Email', weight: 438, align: 'left', tone: 'regular', render: (o) => o.email },
    contactColumn,
    { key: 'date', header: 'Date Registered', weight: 212, align: 'left', render: (o) => o.dateRegistered },
    {
      key: 'action',
      header: 'Action',
      weight: 105,
      align: 'left',
      render: (o) => (
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
        description="Manage operator accounts, review contact information, monitor registration details, and update operator records to maintain accurate system access information."
      />

      <Toolbar
        search={table.search}
        onSearchChange={table.setSearch}
        searchLabel="Search operators"
        actions={
          showArchive ? (
            <>
              <BackButton onClick={toggleArchive} />
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
        columns={showArchive ? archiveColumns : activeColumns}
        rows={table.pageRows}
        rowKey={(o) => o.key}
        gutter
        selection={showArchive ? { selected, onChange: setSelected } : undefined}
        emptyMessage={!ready ? 'Loading…' : showArchive ? 'No archived operators.' : 'No operators match your search.'}
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
              confirmAndAuthorize({ title: 'Add Operator?', message: 'Are you sure you want to add this operator account?' }, () => {
                addOperator(input)
                setEditing(null)
                notify('Successfully Added!', 'The new operator has been added successfully.')
              })
            } else {
              confirmAndAuthorize({ title: 'Save Edit?', message: 'Are you sure you want to save this info?' }, () => {
                updateOperator(editing.key, input)
                setEditing(null)
                notify('Changes Saved Successfully!', 'Your changes have been saved successfully.')
              })
            }
          }}
        />
      )}

      {dialogElement}
    </div>
  )
}
