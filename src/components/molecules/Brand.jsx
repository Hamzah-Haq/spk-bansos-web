import { HandHeart } from 'lucide-react'

export default function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-fg">
        <HandHeart className="size-6" aria-hidden />
      </span>
      <div className="leading-tight">
        <p className="text-lg font-bold">SPK Bansos</p>
        <p className="text-xs opacity-75">Sistem Pendukung Keputusan Penerima Bantuan Sosial</p>
      </div>
    </div>
  )
}
