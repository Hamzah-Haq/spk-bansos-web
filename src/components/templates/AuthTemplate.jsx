import Brand from '../molecules/Brand.jsx'
import ThemePicker from '../molecules/ThemePicker.jsx'

const YEAR = new Date().getFullYear()

// Guest screen: brand panel on the left (from `lg` up), the form (children) centered on the right.
export default function AuthTemplate({ children }) {
  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-[44%] max-w-xl flex-col justify-between border-r border-border bg-sidebar p-10 text-sidebar-fg lg:flex xl:p-14">
        <Brand />

        <div>
          <p className="text-3xl leading-snug font-semibold xl:text-4xl">
            Bantuan sosial yang transparan, akurat, dan tepat sasaran.
          </p>
          <span className="mt-5 block h-1 w-14 rounded-full bg-primary" />
        </div>

        <p className="text-sm text-sidebar-muted">Bersama untuk Kesejahteraan Masyarakat</p>
      </aside>

      <main className="flex flex-1 flex-col px-4 py-8 sm:px-8">
        <div className="lg:hidden">
          <Brand />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <footer className="flex flex-col items-center gap-3 text-xs text-fg-muted sm:flex-row sm:justify-between">
          <ThemePicker />
          <span>© {YEAR} SPK Bansos · Kelompok C</span>
        </footer>
      </main>
    </div>
  )
}
