import { LoaderCircle } from 'lucide-react'

export default function FullPageSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center" role="status">
      <LoaderCircle className="size-8 animate-spin text-primary" aria-hidden />
      <span className="sr-only">Memuat…</span>
    </div>
  )
}
