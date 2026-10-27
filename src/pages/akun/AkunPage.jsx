import { useSearchParams } from 'react-router'
import { MapPin, Users } from 'lucide-react'
import PageHeader from '../../components/PageHeader.jsx'
import RtPanel from './RtPanel.jsx'
import UsersPanel from './UsersPanel.jsx'

const TABS = [
  {
    id: 'akun',
    label: 'Akun Pengguna',
    icon: Users,
  },
  {
    id: 'wilayah',
    label: 'Wilayah RT',
    icon: MapPin,
  },
]

export default function AkunPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'wilayah' ? 'wilayah' : 'akun'

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Manajemen Akun"
        description="Kelola akun Perangkat Desa dan Ketua RT/RW beserta wilayah RT yang menjadi tanggung jawabnya."
      />

      <div className="flex gap-1 border-b border-border" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = id === tab
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSearchParams(id === 'akun' ? {} : { tab: id }, { replace: true })}
              className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                active ? 'border-primary text-primary' : 'border-transparent text-fg-muted hover:text-fg'
              }`}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'akun' ? <UsersPanel /> : <RtPanel />}
    </div>
  )
}
