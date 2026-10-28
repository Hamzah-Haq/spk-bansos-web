import { controlClass } from './control.js'

// options = [{ value, label }]; `placeholder` adds a first empty option. Extra props go to <select>.
export default function Select({
  options,
  placeholder,
  invalid = false,
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <select
      aria-invalid={invalid}
      className={`${controlClass({ invalid, size })} ${className}`}
      {...props}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
}
