import { useMemo, useState } from 'react'

/** Search + pagination state shared by the list pages. */
export function useTableState<T>(rows: T[], searchText: (row: T) => string, pageSize = 10) {
  const [search, setSearchValue] = useState('')
  const [requestedPage, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return rows
    return rows.filter((row) => searchText(row).toLowerCase().includes(query))
  }, [rows, search, searchText])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(requestedPage, pageCount)
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  const setSearch = (value: string) => {
    setSearchValue(value)
    setPage(1)
  }

  return { search, setSearch, page, setPage, pageCount, pageRows, total: filtered.length }
}
