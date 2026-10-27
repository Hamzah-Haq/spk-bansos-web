import { LoaderCircle } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-primary text-primary-fg shadow-sm hover:brightness-110 focus-visible:ring-primary/30',
  secondary: 'border border-border bg-surface text-fg hover:bg-surface-alt focus-visible:ring-primary/20',
  danger: 'bg-danger text-white shadow-sm hover:brightness-110 focus-visible:ring-danger/30',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition ${
        VARIANTS[variant]
      } ${SIZES[size]} focus-visible:ring-4 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : Icon && <Icon className="size-4" aria-hidden />}
      {children}
    </button>
  )
}

const ICON_TONES = {
  default: 'hover:bg-surface-alt hover:text-fg',
  primary: 'hover:bg-primary/10 hover:text-primary',
  success: 'hover:bg-success/10 hover:text-success',
  warning: 'hover:bg-warning/10 hover:text-warning',
  danger: 'hover:bg-danger/10 hover:text-danger',
}

// Icon-only action button for table rows; `label` is the tooltip and the accessible name.
export function IconButton({ icon: Icon, label, tone = 'default', disabled, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg p-2 text-fg-muted transition ${
        ICON_TONES[tone]
      } focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35`}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
