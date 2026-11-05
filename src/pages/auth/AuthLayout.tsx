import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import logo from '../../assets/logo-shield.png'
import accentLine from '../../assets/divider-accent.svg'
import octacoreLogo from '../../assets/octacore-logo.png'
import styles from './Auth.module.css'

export function AuthLayout() {
  const { ready, session } = useAuth()
  const location = useLocation()

  if (!ready) return null
  if (session) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from && from !== '/login' ? from : '/map'} replace />
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <section className={styles.brandPanel}>
          <div className={styles.brand}>
            <img src={logo} alt="" width={118} height={139} className={styles.brandLogo} />
            <div>
              <p className={styles.wordmark}>KALASAG</p>
              <p className={styles.tagline}>Post-earthquake survivor distress network via pre-configured LoRa nodes</p>
            </div>
          </div>
          <img src={accentLine} alt="" width={90} height={5} className={styles.accent} />
          <h2 className={styles.headline}>Post-Earthquake Survivor Distress Network</h2>
          <p className={styles.lead}>Monitor devices and coordinate distress response across the community</p>
          <img src={octacoreLogo} alt="OctaCore Technologies" width={155} height={77} className={styles.octacore} />
        </section>

        <section className={styles.formPanel}>
          <img src={logo} alt="" className={styles.watermark} />
          <Outlet />
        </section>
      </div>
    </div>
  )
}
