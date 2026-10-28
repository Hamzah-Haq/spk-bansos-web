import { Check } from 'lucide-react'
import { useTheme } from '../../../theme/ThemeProvider.jsx'
import Card from '../../molecules/Card.jsx'

// Pengaturan section: pick a color theme, each shown as a mini preview of the app.
export default function ThemeSelectorCard() {
  const { theme, themes, setThemeId } = useTheme()

  return (
    <Card
      title="Tema Warna"
      description="Pilihan tema disimpan di perangkat ini."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="radiogroup" aria-label="Tema warna">
        {themes.map((t) => {
          const active = t.id === theme.id
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setThemeId(t.id)}
              className={`rounded-xl border-2 p-3 text-left transition focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none ${
                active ? 'border-primary' : 'border-border hover:border-fg-muted/50'
              }`}
            >
              <ThemePreview colors={t.colors} />
              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="mt-0.5 text-xs text-fg-muted">{t.description}</p>
                </div>
                {active && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                )}
              </div>
              <div className="mt-3 flex gap-1.5" aria-hidden>
                {['primary', 'success', 'warning', 'danger'].map((key) => (
                  <span key={key} className="size-4 rounded-full" style={{ background: t.colors[key] }} />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function ThemePreview({ colors }) {
  return (
    <div
      className="flex h-24 overflow-hidden rounded-lg border"
      style={{ borderColor: colors.border, background: colors.background }}
      aria-hidden
    >
      <div className="w-1/4 space-y-1.5 p-2" style={{ background: colors.sidebar }}>
        <div className="h-2 rounded-sm" style={{ background: colors.primary }} />
        <div className="h-1.5 w-3/4 rounded-sm opacity-40" style={{ background: colors.sidebarFg }} />
        <div className="h-1.5 w-3/4 rounded-sm opacity-40" style={{ background: colors.sidebarFg }} />
        <div className="h-1.5 w-3/4 rounded-sm opacity-40" style={{ background: colors.sidebarFg }} />
      </div>
      <div className="flex-1 space-y-2 p-2">
        <div className="h-2 w-1/2 rounded-sm" style={{ background: colors.fg }} />
        <div className="space-y-1.5 rounded-md p-2" style={{ background: colors.surface }}>
          <div className="h-1.5 w-3/4 rounded-sm" style={{ background: colors.fgMuted }} />
          <div className="h-1.5 w-1/2 rounded-sm" style={{ background: colors.fgMuted }} />
          <div className="h-3 w-1/3 rounded-sm" style={{ background: colors.primary }} />
        </div>
      </div>
    </div>
  )
}
