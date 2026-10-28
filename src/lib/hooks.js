import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'

// GET `path` and re-fetch whenever it changes or reload() is called.
// Keeps the previous data while reloading so tables don't flash empty between pages.
export function useApiQuery(path) {
  const [version, setVersion] = useState(0)
  // `key` = which request the stored result belongs to; while it differs from the current one we're loading
  const key = `${path}#${version}`
  const [state, setState] = useState({
    key: null,
    data: null,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    api(path)
      .then((data) => !cancelled && setState({ key, data, error: null }))
      .catch((error) => !cancelled && setState((s) => ({ key, data: s.data, error })))
    return () => {
      cancelled = true
    }
  }, [path, key])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const loading = state.key !== key

  return {
    data: state.data,
    error: loading ? null : state.error,
    loading,
    reload,
  }
}

// Form state for dialogs/pages. Spread field() into TextField/SelectField:
//   const form = useForm({ nama: '' })
//   <TextField id="nama" label="Nama" {...form.field('nama')} />
//   form.submit((values) => api(...), validateFn?)
// API field errors (error.details) appear under their inputs; other errors in form.error.
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function field(name) {
    return {
      value: values[name],
      error: errors[name],
      onChange: (e) => {
        const { value } = e.target
        setValues((v) => ({ ...v, [name]: value }))
        setErrors((errs) => (errs[name] ? { ...errs, [name]: undefined } : errs))
      },
    }
  }

  async function submit(action, validate) {
    const clientErrors = validate?.(values) ?? {}
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors)
      return
    }

    setSubmitting(true)
    setError(null)
    setErrors({})
    try {
      await action(values)
    } catch (err) {
      const details = err.details ?? {}
      // 'opsi.0.label' belongs to the `opsi` value; the form shows it next to that list row
      const allShownInline =
        Object.keys(details).length > 0 && Object.keys(details).every((key) => key.split('.')[0] in values)
      setErrors(details)
      setError(allShownInline ? null : err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    values,
    setValues,
    field,
    // { field: message }; for list inputs that field() can't bind (keys like 'opsi.0.label')
    errors,
    setErrors,
    error,
    submitting,
    submit,
  }
}

// Value that only updates after `delay` ms without changes (search boxes).
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
