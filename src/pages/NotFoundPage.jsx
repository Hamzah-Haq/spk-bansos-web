import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-fg-muted">Halaman tidak ditemukan.</p>
      <Link to="/" className="text-sm font-medium text-primary hover:underline">
        Kembali ke beranda
      </Link>
    </main>
  )
}
