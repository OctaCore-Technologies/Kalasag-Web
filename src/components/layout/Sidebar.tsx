import { NavLink } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import logo from '../../assets/logo-shield.png'
import navMap from '../../assets/nav-map.svg'
import navList from '../../assets/nav-list.svg'
import navHistory from '../../assets/nav-history.svg'
import navProfile from '../../assets/nav-profile.svg'
import navSystemLog from '../../assets/nav-system-log.svg'
import iconUser from '../../assets/icon-user.svg'
import iconLogout from '../../assets/icon-logout.svg'
import type { Role } from '../../data/types'
import { MaskIcon } from '../MaskIcon'
import styles from './Sidebar.module.css'

interface NavItem {
  to: string
  label: string
  icon: string
  iconSize: number
  roles: Role[]
}

const NAV_ITEMS: NavItem[] = [
  { to: '/map', label: 'Map', icon: navMap, iconSize: 31, roles: ['admin', 'operator'] },
  { to: '/devices', label: 'Device List', icon: navList, iconSize: 31, roles: ['admin', 'operator'] },
  { to: '/history', label: 'Distress History', icon: navHistory, iconSize: 31, roles: ['admin', 'operator'] },
  { to: '/operators', label: 'Operators Profile', icon: navProfile, iconSize: 26, roles: ['admin'] },
  { to: '/logs', label: 'System Log', icon: navSystemLog, iconSize: 31, roles: ['admin'] },
]

interface SidebarProps {
  onLogout: () => void
}

export function Sidebar({ onLogout }: SidebarProps) {
  const { session } = useAuth()
  const role = session?.role ?? 'operator'
  const isAdmin = role === 'admin'

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src={logo} alt="" width={30} height={35} />
        <div className={styles.brandText}>
          <span className={styles.brandName}>KALASAG</span>
          <span className={styles.brandWelcome}>Welcome {isAdmin ? 'Admin' : 'Operator'}!</span>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Main">
        {NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => [styles.navItem, isActive && styles.active].filter(Boolean).join(' ')}
          >
            <span className={styles.navIcon}>
              <MaskIcon src={item.icon} size={item.iconSize} />
            </span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <img src={iconUser} alt="" width={30} height={30} className={styles.avatar} />
          <div className={styles.userDetails}>
            <span className={styles.userName}>{session?.name}</span>
            <span className={styles.userRole}>Kalasag {isAdmin ? 'Administrator' : 'Operator'}</span>
          </div>
          <button type="button" className={styles.logout} onClick={onLogout} aria-label="Log out">
            <img src={iconLogout} alt="" width={30} height={30} />
          </button>
        </div>
      </div>
    </aside>
  )
}
