import { useData } from '../../data/DataContext'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import styles from './ConnectionBanner.module.css'

/** Offline-first feedback: the console keeps working offline and syncs once reconnected. */
export function ConnectionBanner() {
  const online = useOnlineStatus()
  const { pendingWrites } = useData()

  if (online && !pendingWrites) return null

  return (
    <div className={[styles.banner, online ? styles.syncing : styles.offline].join(' ')} role="status">
      <span className={styles.dot} aria-hidden="true" />
      {online
        ? 'Changes are saved on this device and syncing with the server…'
        : pendingWrites
          ? "You're offline. Changes are saved on this device and will sync when the connection returns."
          : "You're offline. Showing the data saved on this device."}
    </div>
  )
}
