import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { AuthField, AuthFooterLink, AuthHeading, AuthMessage, AuthSubmit } from './AuthForm'
import styles from './Auth.module.css'

export function VerifyCodePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [resent, setResent] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    navigate('/reset-password', { state: location.state })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AuthHeading
        title="Verification Code Sent"
        subtitle={`A verification code has been sent to ${email ?? 'your email address'}. Please check your inbox.`}
      />

      <AuthField
        id="verify-code"
        label="Verification Code"
        placeholder="Enter the verification code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
      />

      {error && <AuthMessage tone="error">{error}</AuthMessage>}

      <AuthSubmit offset={39}>Verify Code &amp; Continue</AuthSubmit>

      <p className={styles.inline}>
        Didn’t receive any code?
        <button
          type="button"
          className={[styles.link, styles.linkButton].join(' ')}
          onClick={() => {
            setResent(true)
            setError(undefined)
          }}
        >
          Resend Code
        </button>
      </p>
      {resent && <AuthMessage tone="info">A new code is on its way. It may take a minute to arrive.</AuthMessage>}

      <AuthFooterLink to="/login">Back to operator login</AuthFooterLink>
    </form>
  )
}
