import { controlClass } from './control.js'

// Text input; extra props go to <input>. A leading `icon` or a `trailing` element (e.g. a
// show-password button) wraps it in a relative box, and `className` then styles that box.
export default function Input({
  invalid = false,
  size = 'md',
  icon: Icon,
  trailing,
  className = '',
  ...props
}) {
  const adorned = Boolean(Icon || trailing)
  const input = (
    <input
      aria-invalid={invalid}
      className={`${controlClass({ invalid, size })} ${Icon ? 'pl-10' : ''} ${trailing ? 'pr-10' : ''} ${
        adorned ? 'w-full' : className
      }`}
      {...props}
    />
  )

  if (!adorned) return input

  return (
    <div className={`relative ${className}`}>
      {Icon && (
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted"
          aria-hidden
        />
      )}
      {input}
      {trailing && <div className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</div>}
    </div>
  )
}
