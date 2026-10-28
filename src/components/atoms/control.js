const BASE =
  'rounded-lg border bg-surface px-3 text-sm text-fg placeholder:text-fg-muted/70 focus:ring-4 focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-fg-muted'

const SIZES = {
  sm: 'py-2',
  md: 'py-2.5',
}

// Shared look of <Input> and <Select>; size `sm` is for compact toolbar filters.
export function controlClass({ invalid = false, size = 'md' } = {}) {
  return `${BASE} ${SIZES[size]} ${
    invalid ? 'border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'
  }`
}
