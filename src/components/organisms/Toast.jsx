import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CircleAlert, CircleCheck, X } from 'lucide-react'

const ToastContext = createContext(null)

const DURATION_MS = 4000

const TONES = {
  success: {
    icon: CircleCheck,
    className: 'text-success',
  },
  error: {
    icon: CircleAlert,
    className: 'text-danger',
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const push = useCallback(
    (tone, message) => {
      const id = crypto.randomUUID()
      setToasts((list) => [...list, { id, tone, message }])
      setTimeout(() => dismiss(id), DURATION_MS)
    },
    [dismiss],
  )

  const toast = useMemo(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
    }),
    [push],
  )

  return (
    <ToastContext value={toast}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex w-80 max-w-[calc(100%-2rem)] flex-col gap-2" aria-live="polite">
        {toasts.map(({ id, tone, message }) => {
          const { icon: Icon, className } = TONES[tone]
          return (
            <div
              key={id}
              role="status"
              className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-fg shadow-lg"
            >
              <Icon className={`mt-0.5 size-5 shrink-0 ${className}`} aria-hidden />
              <p className="flex-1">{message}</p>
              <button
                type="button"
                onClick={() => dismiss(id)}
                aria-label="Tutup notifikasi"
                className="text-fg-muted hover:text-fg"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext>
  )
}

// const toast = useToast(); toast.success('Data tersimpan')
// eslint-disable-next-line react/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
