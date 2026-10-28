import Spinner from '../atoms/Spinner.jsx'

export default function FullPageSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center" role="status">
      <Spinner className="size-8 text-primary" />
      <span className="sr-only">Memuat…</span>
    </div>
  )
}
