import { useCallback, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'

interface DialogSpec {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string | null
  onConfirm: () => void
  onCancel?: () => void
}

/** The confirm → success-notice flow used by every list page in the design. */
export function useDialogs() {
  const [dialog, setDialog] = useState<DialogSpec | null>(null)
  const close = useCallback(() => setDialog(null), [])

  const notify = useCallback(
    (title: string, message: string, then?: () => void) =>
      setDialog({
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
    (spec: Pick<DialogSpec, 'title' | 'message' | 'confirmLabel'>, action: () => void) =>
      setDialog({ ...spec, onConfirm: action, onCancel: close }),
    [close],
  )

  const dialogElement = dialog ? <ConfirmDialog key={dialog.title} {...dialog} /> : null

  return { confirm, notify, close, dialogElement }
}
