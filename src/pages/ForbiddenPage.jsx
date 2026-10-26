import { Link } from 'react-router'
import { ShieldX } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 px-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-danger/10 text-danger">
        <ShieldX className="size-8" aria-hidden />
      </span>
      <h1 className="text-4xl font-bold">403</h1>
      <p className="text-fg-muted">Anda tidak memiliki akses ke halaman ini.</p>
      <Link to="/" className="text-sm font-medium text-primary hover:underline">
        Kembali ke beranda
      </Link>
    </main>
  )
}
