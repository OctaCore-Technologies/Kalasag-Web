import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import { useData } from '../../data/DataContext'
import { ConfirmDialog } from '../ConfirmDialog'
import { ConnectionBanner } from './ConnectionBanner'
import { Sidebar } from './Sidebar'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const { logout } = useAuth()
  const { recordLog } = useData()
  const navigate = useNavigate()
  const [confirmingLogout, setConfirmingLogout] = useState(false)

  const handleLogout = async () => {
    // Give the audit entry a moment to reach the server while still signed in;
    // offline it stays queued and the timeout lets the sign-out continue.
    await Promise.race([recordLog('System Logout', 'User signed out'), new Promise((resolve) => setTimeout(resolve, 1500))])
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.shell}>
      <Sidebar onLogout={() => setConfirmingLogout(true)} />
      <main className={styles.main}>
        <ConnectionBanner />
        <Outlet />
      </main>

      {confirmingLogout && (
        <ConfirmDialog
          title="Log out?"
          message="Are you sure you want to log out of this account?"
          onCancel={() => setConfirmingLogout(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  )
}
