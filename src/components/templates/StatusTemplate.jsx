import { Link } from 'react-router'

// Full-screen status page (403, 404) with a link back home.
export default function StatusTemplate({ icon: Icon, code, message }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 px-4 text-center">
      {Icon && (
        <span className="flex size-16 items-center justify-center rounded-full bg-danger/10 text-danger">
          <Icon className="size-8" aria-hidden />
        </span>
      )}
      <h1 className="text-4xl font-bold">{code}</h1>
      <p className="text-fg-muted">{message}</p>
      <Link to="/" className="text-sm font-medium text-primary hover:underline">
        Kembali ke beranda
      </Link>
    </main>
  )
}
