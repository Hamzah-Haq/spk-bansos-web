import { useId } from 'react'
import { X } from 'lucide-react'
import Alert from './Alert.jsx'
import Button from './Button.jsx'
import Modal from './Modal.jsx'

// Dialog with a form: header, fields (children), error banner and Batal/Simpan footer.
// Render it only while open ({dialog && <FormModal …/>}) so its fields start fresh each time.
export default function FormModal({
  title,
  description,
  onClose,
  onSubmit,
  submitting = false,
  submitLabel = 'Simpan',
  submitVariant = 'primary',
  error,
  children,
}) {
  const titleId = useId()

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Modal
      open
      size="md"
      onClose={onClose}
      labelledBy={titleId}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-sm text-fg-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-1 text-fg-muted hover:bg-surface-alt hover:text-fg"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {error && <Alert>{error}</Alert>}
          {children}
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button type="submit" variant={submitVariant} loading={submitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
