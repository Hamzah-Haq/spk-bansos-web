import { useAuth } from '../auth/AuthProvider.jsx'
import AccountInfoCard from '../components/organisms/dashboard/AccountInfoCard.jsx'
import MenuShortcuts from '../components/organisms/dashboard/MenuShortcuts.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <PageTemplate
      title={`Selamat Datang, ${user.nama}`}
      description="Sistem Pendukung Keputusan Penerima Bantuan Sosial menggunakan Metode Simple Additive Weighting (SAW)."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <AccountInfoCard />
      </div>

      <MenuShortcuts />
    </PageTemplate>
  )
}
