import { useId, useState, type FormEvent } from 'react'
import logo from '../assets/logo-shield.png'
import backIcon from '../assets/icon-arrow-back-sm.svg'
import { Modal } from './Modal'
import styles from './AuthorizationCodeDialog.module.css'

interface AuthorizationCodeDialogProps {
  onVerify: () => void
  onBack: () => void
}

/**
 * Operator-account changes need a code the Administrator receives. The code
 * isn't checked yet — any digits pass until the Express API issues real codes.
 */
export function AuthorizationCodeDialog({ onVerify, onBack }: AuthorizationCodeDialogProps) {
  const titleId = useId()
  const inputId = useId()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!/^\d{4,10}$/.test(code)) {
      setError('Enter the numeric code from your Administrator.')
      return
    }
    onVerify()
  }

  return (
    <Modal onClose={onBack} labelledBy={titleId} className={styles.dialog}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <header className={styles.header}>
          <img src={logo} alt="" width={54} height={64} />
          <p className={styles.brand}>KALASAG</p>
          <h2 id={titleId} className={styles.title}>
            Authorization Code Sent
          </h2>
          <p className={styles.subtext}>
            An authorization code has been sent to the Administrator.
            <br />
            Please coordinate with your Administrator for verification.
          </p>
        </header>

        <div className={styles.field}>
          <label htmlFor={inputId} className={styles.label}>
            Enter Valid Authorization Code
          </label>
          <input
            id={inputId}
            className={styles.input}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={10}
            placeholder="1234567890"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ''))
              setError(undefined)
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            autoFocus
          />
          {error && (
            <p id={`${inputId}-error`} className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>

        <button type="submit" className={styles.submit}>
          Verify Code &amp; Continue
        </button>

        <div className={styles.footer}>
          <button type="button" className={styles.back} onClick={onBack}>
            <img src={backIcon} alt="" width={12} height={10} />
            Go Back
          </button>
        </div>
      </form>
    </Modal>
  )
}
