const CONTROL_CLASS =
  'w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-muted/70 ' +
  'focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-fg-muted'

function controlClass(error) {
  return `${CONTROL_CLASS} ${
    error ? 'border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'
  }`
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
        {label}
      </label>
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

// <TextField id="nama" label="Nama" value={..} onChange={..} error={errors.nama} /> — extra props go to <input>
export function TextField({ id, label, error, hint, ...inputProps }) {
  return (
    <Field
      id={id}
      label={label}
      error={error}
      hint={hint}
    >
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={controlClass(error)}
        {...inputProps}
      />
    </Field>
  )
}

// options = [{ value, label }]; `placeholder` adds a first empty option
export function SelectField({ id, label, error, hint, options, placeholder, ...selectProps }) {
  return (
    <Field
      id={id}
      label={label}
      error={error}
      hint={hint}
    >
      <select
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={controlClass(error)}
        {...selectProps}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map(({ value, label: optionLabel }) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
    </Field>
  )
}
