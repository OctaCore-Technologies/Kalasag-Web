import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  pageCount: number
  shown: number
  total: number
  noun: string
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, pageCount, shown, total, noun, onPageChange, className }: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)
  return (
    <nav className={[styles.bar, className].filter(Boolean).join(' ')} aria-label={`${noun} pagination`}>
      <p className={styles.summary}>
        Showing {shown} of {total} total {noun} (Page {page} of {pageCount})
      </p>
      <div className={styles.controls}>
        <button
          type="button"
          className={[styles.step, styles.previous].join(' ')}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={[styles.page, p === page && styles.current].filter(Boolean).join(' ')}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button type="button" className={styles.step} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </nav>
  )
}
