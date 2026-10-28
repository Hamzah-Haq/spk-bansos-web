import { Link } from 'react-router'
import { ChevronRight, CircleAlert, CircleCheck, ClipboardCheck, Info, TriangleAlert } from 'lucide-react'
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
  primary: {
    icon: ClipboardCheck,
    className: 'text-primary',
  },
  info: {
    icon: Info,
    className: 'text-info',
  },
}

function desaItems(d) {
  const home = ROLE_HOME.desa
  const items = []
  if (d.periode?.status !== 'open') {
    items.push({
      tone: 'info',
      text: 'Belum ada periode yang dibuka. Ketua RT belum dapat memulai survei.',
      to: `${home}/periode`,
    })
  }
  if (d.kuesioner.belumBerOpsi.length) {
    items.push({
      tone: 'warning',
      text:
        `${d.kuesioner.belumBerOpsi.length} pertanyaan (${d.kuesioner.belumBerOpsi.join(', ')}) belum memiliki ` +
        'opsi jawaban, sehingga survei belum dapat dimulai.',
      to: `${home}/kriteria`,
    })
  }
  if (Math.round(d.kuesioner.totalBobot * 1000) !== 1000) {
    items.push({
      tone: 'danger',
      text: `Total bobot kriteria ${d.kuesioner.totalBobot.toLocaleString('id-ID')}, seharusnya 1.`,
      to: `${home}/kriteria`,
    })
  }
  if (!d.akunRtAktif) {
    items.push({
      tone: 'warning',
      text: 'Belum ada akun Ketua RT yang aktif.',
      to: `${home}/akun`,
    })
  }
  if (d.survei.submitted) {
    items.push({
      tone: 'primary',
      text: `${d.survei.submitted} survei menunggu verifikasi.`,
      to: `${home}/verifikasi`,
    })
  }
  return items
}

function rtItems(d) {
  const home = ROLE_HOME.rt
  const items = []
  if (d.periode?.status !== 'open') {
    items.push({
      tone: 'info',
      text: 'Belum ada periode yang dibuka. Survei dapat dimulai setelah perangkat desa membuka periode.',
    })
  }
  if (d.survei.rejected) {
    items.push({
      tone: 'danger',
      text: `${d.survei.rejected} survei dikembalikan untuk direvisi.`,
      to: `${home}/survei?status=rejected`,
    })
  }
  if (d.survei.draft) {
    items.push({
      tone: 'warning',
      text: `${d.survei.draft} survei masih draf dan belum dikirim.`,
      to: `${home}/survei?status=draft`,
    })
  }
  if (d.periode?.status === 'open' && d.kk.belumDisurvei) {
    items.push({
      tone: 'primary',
      text: `${d.kk.belumDisurvei} KK di wilayah Anda belum disurvei pada periode ini.`,
      to: `${home}/survei`,
    })
  }
  return items
}

// What needs attention now, each linking to the page where it's handled.
export default function ActionItems({ role, dashboard }) {
  const items = role === 'desa' ? desaItems(dashboard) : rtItems(dashboard)

  return (
    <Card title="Perlu Ditindaklanjuti">
      {items.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-fg-muted">
          <CircleCheck className="size-5 text-success" aria-hidden />
          Tidak ada yang perlu ditindaklanjuti saat ini.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <ActionRow key={item.text} {...item} />
          ))}
        </ul>
      )}
    </Card>
  )
}

function ActionRow({ tone, text, to }) {
  const { icon: Icon, className } = TONES[tone]
  const content = (
    <>
      <Icon className={`size-5 shrink-0 ${className}`} aria-hidden />
      <span className="flex-1">{text}</span>
      {to && <ChevronRight className="size-4 shrink-0 text-fg-muted" aria-hidden />}
    </>
  )

  return (
    <li>
      {to ? (
        <Link to={to} className="flex items-center gap-3 py-3 text-sm first:pt-0 hover:text-primary">
          {content}
        </Link>
      ) : (
        <div className="flex items-center gap-3 py-3 text-sm first:pt-0">{content}</div>
      )}
    </li>
  )
}
