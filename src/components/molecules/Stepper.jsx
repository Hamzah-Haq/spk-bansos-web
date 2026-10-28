import { Check } from 'lucide-react'

// Horizontal step list for multi-step forms. steps = [{ key, label, title?, done }];
// every step is clickable (onSelect(index)), the parent decides what moving means (e.g. save first).
export default function Stepper({ steps, current, onSelect, disabled = false }) {
  return (
    <nav aria-label="Langkah pengisian">
      <ol className="flex flex-wrap gap-2">
        {steps.map((step, index) => {
          const active = index === current
          return (
            <li key={step.key}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={disabled}
                aria-current={active ? 'step' : undefined}
                title={step.title}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'border-primary bg-primary text-primary-fg'
                    : 'border-border bg-surface text-fg-muted hover:border-primary/40 hover:text-fg'
                } focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none disabled:cursor-wait`}
              >
                <span
                  className={`flex size-5 items-center justify-center rounded-full text-xs ${
                    active ? 'bg-primary-fg/20' : step.done ? 'bg-success/15 text-success' : 'bg-surface-alt'
                  }`}
                >
                  {step.done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : index + 1}
                </span>
                {step.label}
                {step.done && <span className="sr-only">(lengkap)</span>}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
