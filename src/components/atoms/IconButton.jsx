const TONES = {
  default: 'hover:bg-surface-alt hover:text-fg',
  primary: 'hover:bg-primary/10 hover:text-primary',
  success: 'hover:bg-success/10 hover:text-success',
  warning: 'hover:bg-warning/10 hover:text-warning',
  danger: 'hover:bg-danger/10 hover:text-danger',
}

// Icon-only action button for table rows; `label` is the tooltip and the accessible name.
export default function IconButton({ icon: Icon, label, tone = 'default', disabled, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg p-2 text-fg-muted transition ${
        TONES[tone]
      } focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35`}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
