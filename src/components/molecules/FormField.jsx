import Input from '../atoms/Input.jsx'
import Label from '../atoms/Label.jsx'
import Select from '../atoms/Select.jsx'

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-fg-muted">{hint}</p>
      )}
    </div>
  )
}

// <TextField id="nama" label="Nama" value={..} onChange={..} error={errors.nama} /> — extra props go to
// <Input>, so `icon` and `trailing` work here too
export function TextField({ id, label, error, hint, ...inputProps }) {
  return (
    <Field
      id={id}
      label={label}
      error={error}
      hint={hint}
    >
      <Input
        id={id}
        name={id}
        invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full"
        {...inputProps}
      />
    </Field>
  )
}

// options = [{ value, label }]; `placeholder` adds a first empty option
export function SelectField({ id, label, error, hint, ...selectProps }) {
  return (
    <Field
      id={id}
      label={label}
      error={error}
      hint={hint}
    >
      <Select
        id={id}
        name={id}
        invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full"
        {...selectProps}
      />
    </Field>
  )
}
