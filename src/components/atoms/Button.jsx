import Spinner from './Spinner.jsx'

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
      {loading ? <Spinner /> : Icon && <Icon className="size-4" aria-hidden />}
      {children}
    </button>
  )
}
