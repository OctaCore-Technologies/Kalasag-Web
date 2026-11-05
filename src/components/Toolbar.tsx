import type { ReactNode } from 'react'
import iconSearch from '../assets/icon-search.svg'
import styles from './Toolbar.module.css'

interface ToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  searchLabel?: string
  children?: ReactNode
  actions?: ReactNode
}

export function Toolbar({ search, onSearchChange, searchLabel = 'Search', children, actions }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <label className={styles.search}>
        <img src={iconSearch} alt="" width={18} height={18} />
        <span className="visually-hidden">{searchLabel}</span>
        <input
          type="search"
          placeholder="Search here"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
      {children}
      <div className={styles.actions}>{actions}</div>
    </div>
  )
}

interface TabsProps<T extends string> {
  tabs: readonly T[]
  value: T
  onChange: (value: T) => void
  label: string
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: TabsProps<T>) {
  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === value}
          className={[styles.tab, tab === value && styles.tabActive].filter(Boolean).join(' ')}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
