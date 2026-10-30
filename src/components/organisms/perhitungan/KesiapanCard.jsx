import { Link } from 'react-router'
import { ChevronRight, CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { ROLE_HOME } from '../../../auth/roles.js'
import Card from '../../molecules/Card.jsx'

const TONES = {
  danger: {
    icon: CircleAlert,
    className: 'text-danger',
  },
  warning: {
    icon: TriangleAlert,
    className: 'text-warning',
  },
  info: {
    icon: Info,
    className: 'text-info',
  },
  success: {
    icon: CircleCheck,
    className: 'text-success',
  },
}

// Checklist from kesiapanPerhitungan(); items with `to` link to the desa page that fixes them.
export default function KesiapanCard({ items, actions }) {
  return (
    <Card
      title="Kesiapan Perhitungan"
      description="SAW hanya menghitung survei yang sudah terverifikasi, memakai bobot dan sifat kriteria saat ini."
      actions={actions}
    >
      <ul className="divide-y divide-border">
        {items.map(({ tone, text, to }) => {
          const { icon: Icon, className } = TONES[tone]
          const content = (
            <>
              <Icon className={`size-5 shrink-0 ${className}`} aria-hidden />
              <span className="flex-1">{text}</span>
              {to && <ChevronRight className="size-4 shrink-0 text-fg-muted" aria-hidden />}
            </>
          )
          return (
            <li key={text}>
              {to ? (
                <Link
                  to={`${ROLE_HOME.desa}/${to}`}
                  className="flex items-center gap-3 py-3 text-sm first:pt-0 hover:text-primary"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex items-center gap-3 py-3 text-sm first:pt-0">{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
