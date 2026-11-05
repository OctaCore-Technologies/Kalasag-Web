import { useCallback, useState } from 'react'
import { AuthorizationCodeDialog } from '../components/AuthorizationCodeDialog'
import { ConfirmDialog } from '../components/ConfirmDialog'

interface ConfirmSpec {
  kind: 'confirm'
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string | null
  onConfirm: () => void
  onCancel?: () => void
}

interface AuthorizeSpec {
  kind: 'authorize'
  onVerify: () => void
}

/** The confirm → (authorization code) → success-notice flow used by every list page in the design. */
export function useDialogs() {
  const [dialog, setDialog] = useState<ConfirmSpec | AuthorizeSpec | null>(null)
  const close = useCallback(() => setDialog(null), [])

  const notify = useCallback(
    (title: string, message: string, then?: () => void) =>
      setDialog({
        kind: 'confirm',
        title,
        message,
        cancelLabel: null,
        onConfirm: () => {
          close()
          then?.()
        },
      }),
    [close],
  )

  const confirm = useCallback(
    (spec: { title: string; message: string; confirmLabel?: string }, action: () => void) =>
      setDialog({ kind: 'confirm', ...spec, onConfirm: action, onCancel: close }),
    [close],
  )

  const authorize = useCallback((action: () => void) => setDialog({ kind: 'authorize', onVerify: action }), [])

  let dialogElement = null
  if (dialog?.kind === 'confirm') {
    const { kind: _kind, ...props } = dialog
    dialogElement = <ConfirmDialog key={dialog.title} {...props} />
  } else if (dialog?.kind === 'authorize') {
    dialogElement = <AuthorizationCodeDialog key="authorize" onVerify={dialog.onVerify} onBack={close} />
  }

  return { confirm, authorize, notify, close, dialogElement }
}
