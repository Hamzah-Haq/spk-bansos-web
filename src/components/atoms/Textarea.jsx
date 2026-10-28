import { controlClass } from './control.js'

// Multi-line text input with the same look as <Input>; extra props go to <textarea>.
export default function Textarea({
  invalid = false,
  rows = 3,
  className = '',
  ...props
}) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid}
      className={`${controlClass({ invalid })} resize-y ${className}`}
      {...props}
    />
  )
}
