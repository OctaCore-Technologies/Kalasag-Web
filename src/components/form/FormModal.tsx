import {
  useId,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import dropdownIcon from '../../assets/icon-dropdown.svg'
import { Button } from '../Button'
import { Modal } from '../Modal'
import styles from './FormModal.module.css'

interface FormModalProps {
  title: string
  subtitle: string
  icon: string
  submitLabel: string
  /** Device forms use 144 × 44 block buttons; the operator form uses dialog-style pills. */
  buttonShape?: 'block' | 'pill'
  onSubmit: () => void
  onCancel: () => void
  children: ReactNode
}

export function FormModal({
  title,
  subtitle,
  icon,
  submitLabel,
  buttonShape = 'block',
  onSubmit,
  onCancel,
  children,
}: FormModalProps) {
  const pill = buttonShape === 'pill'
  const titleId = useId()
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Modal onClose={onCancel} labelledBy={titleId} className={styles.modal}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <header className={styles.header}>
          <span className={styles.iconBox}>
            <img src={icon} alt="" width={20} height={20} />
          </span>
          <div>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
        </header>
        <div className={styles.body}>{children}</div>
        <footer className={[styles.footer, pill && styles.pillFooter].filter(Boolean).join(' ')}>
          <Button
            variant={pill ? 'outline' : 'ghost'}
            size={pill ? 'pill' : 'md'}
            onClick={onCancel}
            className={pill ? undefined : styles.footerButton}
          >
            Cancel
          </Button>
          <Button type="submit" size={pill ? 'pill' : 'md'} className={pill ? undefined : styles.footerButton}>
            {submitLabel}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionPill} aria-hidden="true" />
        {title}
      </h3>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  )
}

export function FormRow({ columns = 2, children }: { columns?: 2 | 3; children: ReactNode }) {
  return <div className={[styles.row, columns === 3 && styles.row3].filter(Boolean).join(' ')}>{children}</div>
}

export function Divider() {
  return <hr className={styles.divider} />
}

interface FieldProps {
  label: string
  htmlFor: string
  required?: boolean
  children: ReactNode
}

export function Field({ label, htmlFor, required, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      {children}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function TextInput(props: InputProps) {
  return <input {...props} className={styles.input} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={2} {...props} className={styles.input} />
}

export function IconInput({ icon, ...props }: InputProps & { icon: string }) {
  return (
    <div className={styles.inputWithIcon}>
      <img src={icon} alt="" width={16} height={16} className={styles.inputIcon} />
      <input {...props} className={styles.input} />
    </div>
  )
}

export function PrefixInput({ prefix, ...props }: InputProps & { prefix: string }) {
  return (
    <div className={styles.prefixWrap}>
      <span className={styles.prefix} aria-hidden="true">
        {prefix}
      </span>
      <input {...props} className={styles.input} />
    </div>
  )
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={styles.selectWrap}>
      <select {...props} className={styles.input} />
      <img src={dropdownIcon} alt="" width={24} height={24} className={styles.selectIcon} />
    </div>
  )
}
