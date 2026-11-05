import { useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router'
import eyeIcon from '../../assets/icon-eye.svg'
import eyeSlashedIcon from '../../assets/icon-eye-slashed.svg'
import styles from './Auth.module.css'

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className={styles.heading}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  )
}

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  id: string
  label: string
  icon?: string
  iconSize?: [number, number]
  revealable?: boolean
}

export function AuthField({ id, label, icon, iconSize = [20, 21], revealable, type = 'text', ...input }: AuthFieldProps) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={[styles.inputBox, icon && styles.hasIcon, revealable && styles.hasToggle].filter(Boolean).join(' ')}>
        {icon && <img src={icon} alt="" width={iconSize[0]} height={iconSize[1]} className={styles.inputIcon} />}
        <input id={id} type={revealable && revealed ? 'text' : type} className={styles.input} {...input} />
        {revealable && (
          <button
            type="button"
            className={styles.reveal}
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
          >
            <img src={revealed ? eyeIcon : eyeSlashedIcon} alt="" width={revealed ? 24 : 21} height={revealed ? 16 : 18} />
          </button>
        )}
      </div>
    </div>
  )
}

export function AuthSubmit({ children, offset }: { children: ReactNode; offset: number }) {
  return (
    <button type="submit" className={styles.submit} style={{ marginTop: offset } as CSSProperties}>
      {children}
    </button>
  )
}

export function AuthMessage({ tone, children }: { tone: 'error' | 'info'; children: ReactNode }) {
  return (
    <p className={[styles.message, styles[tone]].join(' ')} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}

export function AuthFooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <div className={styles.footer}>
      <Link to={to} className={styles.link}>
        {children}
      </Link>
    </div>
  )
}
