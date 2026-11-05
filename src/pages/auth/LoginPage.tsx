import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../auth/AuthContext'
import { useData } from '../../data/DataContext'
import profileIcon from '../../assets/icon-profile.svg'
import lockIcon from '../../assets/icon-lock.svg'
import { AuthField, AuthHeading, AuthMessage, AuthSubmit } from './AuthForm'
import styles from './Auth.module.css'

export function LoginPage() {
  const { login } = useAuth()
  const { recordLog } = useData()
  const location = useLocation()
  const notice = (location.state as { notice?: string } | null)?.notice
  const [operatorId, setOperatorId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const session = await login(operatorId, password)
      recordLog('System Login', 'User authenticated successfully', session.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AuthHeading title="Operator Login" subtitle="Access your account to manage the system." />

      <AuthField
        id="login-id"
        label="Operator ID"
        icon={profileIcon}
        placeholder="Enter your operator ID"
        autoComplete="username"
        value={operatorId}
        onChange={(e) => setOperatorId(e.target.value)}
      />
      <AuthField
        id="login-password"
        label="Password"
        icon={lockIcon}
        type="password"
        revealable
        placeholder="Enter your password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Link to="/forgot-password" className={[styles.link, styles.forgot].join(' ')}>
        Forgot Password?
      </Link>

      {error && <AuthMessage tone="error">{error}</AuthMessage>}
      {!error && notice && <AuthMessage tone="info">{notice}</AuthMessage>}

      <AuthSubmit offset={error || notice ? 34 : 50}>Log In</AuthSubmit>
    </form>
  )
}
