import { useEffect, useRef } from 'react'

export default function Modal({ open, onClose, labelledBy, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={labelledBy}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-border bg-surface p-0 text-fg shadow-xl backdrop:bg-black/50"
    >
      {children}
    </dialog>
  )
}
