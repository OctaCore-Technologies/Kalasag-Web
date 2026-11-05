import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import lockIcon from '../../assets/icon-lock.svg'
import { AuthField, AuthFooterLink, AuthHeading, AuthMessage, AuthSubmit } from './AuthForm'

const MIN_LENGTH = 8

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string>()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (password.length < MIN_LENGTH) {
      setError(`Use at least ${MIN_LENGTH} characters for your new password.`)
      return
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }
    navigate('/login', { replace: true, state: { notice: 'Password updated. Log in with your new password.' } })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AuthHeading title="Create New Password" subtitle="Your new password will be saved and used for future logins." />

      <AuthField
        id="new-password"
        label="New Password"
        icon={lockIcon}
        type="password"
        revealable
        placeholder="Enter your new password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <AuthField
        id="confirm-password"
        label="Confirm New Password"
        icon={lockIcon}
        type="password"
        revealable
        placeholder="Confirm your password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && <AuthMessage tone="error">{error}</AuthMessage>}

      <AuthSubmit offset={error ? 34 : 64}>Update Password &amp; Return to Login</AuthSubmit>
      <AuthFooterLink to="/login">Cancel &amp; Return to Operator Login</AuthFooterLink>
    </form>
  )
}
