import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import { useData } from '../../data/DataContext'
import { ConfirmDialog } from '../ConfirmDialog'
import { Sidebar } from './Sidebar'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const { logout } = useAuth()
  const { recordLog } = useData()
  const navigate = useNavigate()
  const [confirmingLogout, setConfirmingLogout] = useState(false)

  return (
    <div className={styles.shell}>
      <Sidebar onLogout={() => setConfirmingLogout(true)} />
      <main className={styles.main}>
        <Outlet />
      </main>

      {confirmingLogout && (
        <ConfirmDialog
          title="Log out of Kalasag?"
          message="You will need to sign in again to access the console."
          confirmLabel="Log Out"
          onCancel={() => setConfirmingLogout(false)}
          onConfirm={() => {
            recordLog('System Logout', 'User signed out')
            logout()
            navigate('/login', { replace: true })
          }}
        />
      )}
    </div>
  )
}
