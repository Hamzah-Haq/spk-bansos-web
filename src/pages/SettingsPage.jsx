import ChangePasswordCard from '../components/organisms/settings/ChangePasswordCard.jsx'
import ThemeSelectorCard from '../components/organisms/settings/ThemeSelectorCard.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'

export default function SettingsPage() {
  return (
    <PageTemplate
      title="Pengaturan"
      description="Sesuaikan tampilan aplikasi dan keamanan akun Anda."
    >
      <ChangePasswordCard />
      <ThemeSelectorCard />
    </PageTemplate>
  )
}
