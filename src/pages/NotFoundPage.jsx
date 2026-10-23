import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-slate-800">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-slate-500">Halaman tidak ditemukan.</p>
      <Link to="/" className="text-sm font-medium text-emerald-700 hover:underline">
        Kembali ke beranda
      </Link>
    </main>
  )
}
