import { CircleAlert, Info } from 'lucide-react'

const TONES = {
  danger: {
    icon: CircleAlert,
    className: 'border-danger/30 bg-danger/10 text-danger',
  },
  info: {
    icon: Info,
    className: 'border-info/30 bg-info/10 text-info',
  },
}

export default function Alert({ tone = 'danger', className = '', children }) {
  const { icon: Icon, className: toneClass } = TONES[tone]
  return (
    <div
      role={tone === 'danger' ? 'alert' : undefined}
      className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${toneClass} ${className}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  )
}
