import type { ReactNode } from 'react'
import styles from './DataTable.module.css'

export interface Column<T> {
  key: string
  header: string
  /** Relative column width; columns share the space left after the gutter. */
  weight: number
  align?: 'left' | 'center'
  tone?: 'light' | 'regular'
  /** Extra leading padding (px) to shift a column's content to its spot in the design. */
  inset?: number
  render: (row: T) => ReactNode
}

interface Selection {
  selected: ReadonlySet<string>
  onChange: (next: Set<string>) => void
}

interface DataTableProps<T> {
  caption: string
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  size?: 'md' | 'sm'
  /** Leading 81px column used by the left-aligned tables (holds checkboxes when selecting). */
  gutter?: boolean
  selection?: Selection
  highlightedKey?: string
  emptyMessage?: string
}

export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  size = 'md',
  gutter = false,
  selection,
  highlightedKey,
  emptyMessage = 'No records to show.',
}: DataTableProps<T>) {
  const totalWeight = columns.reduce((sum, c) => sum + c.weight, 0)
  const hasGutter = gutter || Boolean(selection)
  const keys = rows.map(rowKey)
  const allSelected = Boolean(selection) && keys.length > 0 && keys.every((k) => selection!.selected.has(k))

  const toggle = (key: string) => {
    if (!selection) return
    const next = new Set(selection.selected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    selection.onChange(next)
  }

  const toggleAll = () => {
    if (!selection) return
    const next = new Set(selection.selected)
    keys.forEach((k) => (allSelected ? next.delete(k) : next.add(k)))
    selection.onChange(next)
  }

  return (
    <div className={[styles.wrap, styles[size]].join(' ')}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        <colgroup>
          {hasGutter && <col className={styles.gutterCol} />}
          {columns.map((c) => (
            <col key={c.key} style={{ width: `${(c.weight / totalWeight) * 100}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {hasGutter && (
              <th scope="col" className={styles.gutter}>
                {selection && (
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all rows"
                  />
                )}
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={c.align === 'left' ? styles.left : undefined}
                style={c.inset ? { paddingLeft: c.inset } : undefined}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (hasGutter ? 1 : 0)} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          )}
          {rows.map((row) => {
            const key = rowKey(row)
            return (
              <tr key={key} className={key === highlightedKey ? styles.highlighted : undefined}>
                {hasGutter && (
                  <td className={styles.gutter}>
                    {selection && (
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selection.selected.has(key)}
                        onChange={() => toggle(key)}
                        aria-label={`Select ${key}`}
                      />
                    )}
                  </td>
                )}
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[c.align === 'left' && styles.left, c.tone === 'regular' && styles.regular]
                      .filter(Boolean)
                      .join(' ')}
                    style={c.inset ? { paddingLeft: c.inset } : undefined}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
