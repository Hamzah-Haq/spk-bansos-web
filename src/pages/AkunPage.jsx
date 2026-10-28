import { useSearchParams } from 'react-router'
import { MapPin, Users } from 'lucide-react'
import Tabs from '../components/molecules/Tabs.jsx'
import RtPanel from '../components/organisms/akun/RtPanel.jsx'
import UsersPanel from '../components/organisms/akun/UsersPanel.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'

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
    <PageTemplate
      title="Manajemen Akun"
      description="Kelola akun Perangkat Desa dan Ketua RT/RW beserta wilayah RT yang menjadi tanggung jawabnya."
    >
      <Tabs
        tabs={TABS}
        active={tab}
        onChange={(id) => setSearchParams(id === 'akun' ? {} : { tab: id }, { replace: true })}
      />

      {tab === 'akun' ? <UsersPanel /> : <RtPanel />}
    </PageTemplate>
  )
}
