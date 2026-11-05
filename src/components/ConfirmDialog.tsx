import { useId } from 'react'
import logo from '../assets/logo-shield.png'
import { Button } from './Button'
import { Modal } from './Modal'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  /** Pass `null` for a single-button notice (e.g. "Successfully Added!"). */
  cancelLabel?: string | null
  onConfirm: () => void
  onCancel?: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()
  return (
    <Modal onClose={onCancel ?? onConfirm} labelledBy={titleId} className={styles.dialog}>
      <div className={styles.brand}>
        <img src={logo} alt="" width={30} height={35} />
        <span>KALASAG</span>
      </div>
      <div className={styles.body}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p className={styles.message}>{message}</p>
      </div>
      <div className={styles.actions}>
        {cancelLabel !== null && onCancel && (
          <Button variant="outline" size="pill" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button size="pill" onClick={onConfirm} autoFocus>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
