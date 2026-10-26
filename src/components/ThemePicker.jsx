import { Check } from 'lucide-react'
import { useTheme } from '../theme/ThemeProvider.jsx'

export default function ThemePicker({ className = '' }) {
  const { theme, themes, setThemeId } = useTheme()

  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label="Pilih tema warna">
      {themes.map((t) => {
        const active = t.id === theme.id
        return (
          <button
            key={t.id}
            type="button"
            title={t.name}
            aria-label={t.name}
            aria-pressed={active}
            onClick={() => setThemeId(t.id)}
            className={`flex size-7 items-center justify-center rounded-full border-2 transition ${
              active ? 'border-fg' : 'border-border hover:border-fg-muted'
            }`}
            style={{ background: `linear-gradient(135deg, ${t.colors.sidebar} 50%, ${t.colors.primary} 50%)` }}
          >
            {active && <Check className="size-3.5 text-white drop-shadow" strokeWidth={3} aria-hidden />}
          </button>
        )
      })}
    </div>
  )
}
