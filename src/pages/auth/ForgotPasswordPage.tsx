import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import profileIcon from '../../assets/icon-profile.svg'
import { AuthField, AuthFooterLink, AuthHeading, AuthMessage, AuthSubmit } from './AuthForm'

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [operatorId, setOperatorId] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!operatorId.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter your operator ID and a valid email address.')
      return
    }
    // TODO: call the password-reset endpoint once the Express API is available.
    navigate('/verify-code', { state: { operatorId: operatorId.trim(), email: email.trim() } })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AuthHeading
        title="Operator Password Reset"
        subtitle="Enter your registered Operator ID and email address to receive a verification code."
      />

      <AuthField
        id="reset-id"
        label="Operator ID"
        icon={profileIcon}
        placeholder="Enter your operator ID"
        autoComplete="username"
        value={operatorId}
        onChange={(e) => setOperatorId(e.target.value)}
      />
      <AuthField
        id="reset-email"
        label="Email Address"
        icon={profileIcon}
        type="email"
        placeholder="Enter your email address"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <AuthMessage tone="error">{error}</AuthMessage>}

      <AuthSubmit offset={error ? 40 : 108}>Request Verification Code</AuthSubmit>
      <AuthFooterLink to="/login">Back to operator login</AuthFooterLink>
    </form>
  )
}
