import { Construction } from 'lucide-react'
import PageTemplate from '../components/templates/PageTemplate.jsx'

export default function ComingSoonPage({ title }) {
  return (
    <PageTemplate title={title}>
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-warning/15 text-warning">
          <Construction className="size-7" aria-hidden />
        </span>
        <p className="mt-4 font-semibold">Halaman sedang dalam pengembangan</p>
        <p className="mt-1 text-sm text-fg-muted">Fitur {title} akan tersedia pada tahap berikutnya.</p>
      </div>
    </PageTemplate>
  )
}
