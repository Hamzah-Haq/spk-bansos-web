import { useState } from 'react'
import FormModal from './FormModal.jsx'

// Asks before a destructive or important action. onConfirm may be async; if it throws, the
// message is shown in the dialog (e.g. the API's 409 "masih digunakan") and the dialog stays open.
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Ya, lanjutkan',
  tone = 'danger',
  onConfirm,
  onClose,
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)
    try {
      await onConfirm()
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <FormModal
      title={title}
      onClose={onClose}
      onSubmit={handleConfirm}
      submitting={submitting}
      submitLabel={confirmLabel}
      submitVariant={tone === 'danger' ? 'danger' : 'primary'}
      error={error}
    >
      <div className="text-sm text-fg-muted">{message}</div>
    </FormModal>
  )
}
