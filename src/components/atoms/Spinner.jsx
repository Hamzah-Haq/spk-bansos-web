import { LoaderCircle } from 'lucide-react'

// Decorative spinning loader; size and color come from `className`.
export default function Spinner({ className = 'size-4' }) {
  return <LoaderCircle className={`animate-spin ${className}`} aria-hidden />
}
