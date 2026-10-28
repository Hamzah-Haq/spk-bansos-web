import { BadgeCheck, ClipboardCheck, House, Undo2, UserSearch } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { ROLE_HOME } from '../auth/roles.js'
import Alert from '../components/molecules/Alert.jsx'
import StatTile from '../components/molecules/StatTile.jsx'
import AccountInfoCard from '../components/organisms/dashboard/AccountInfoCard.jsx'
import ActionItems from '../components/organisms/dashboard/ActionItems.jsx'
import MenuShortcuts from '../components/organisms/dashboard/MenuShortcuts.jsx'
import RtProgressTable from '../components/organisms/dashboard/RtProgressTable.jsx'
import SurveiProgressCard from '../components/organisms/dashboard/SurveiProgressCard.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'
import { formatRt } from '../lib/format.js'
import { useApiQuery } from '../lib/hooks.js'

// KPI tiles per role. Desa watches the verification queue, RT its own revisions.
function tiles(role, d) {
  const home = ROLE_HOME[role]
  if (role === 'desa') {
    return [
      {
        label: 'Total KK',
        value: d.kk.total,
        icon: House,
        to: `${home}/warga`,
      },
      {
        label: 'Belum disurvei',
        value: d.kk.belumDisurvei,
        icon: UserSearch,
        hint: d.periode ? `Pada periode ${d.periode.nama}` : undefined,
      },
      {
        label: 'Menunggu verifikasi',
        value: d.survei.submitted,
        icon: ClipboardCheck,
        to: `${home}/verifikasi`,
      },
      {
        label: 'Terverifikasi',
        value: d.survei.verified,
        icon: BadgeCheck,
        hint: d.periode ? `Kuota penerima ${d.periode.kuota} KK` : undefined,
        to: `${home}/verifikasi?status=verified`,
      },
    ]
  }
  return [
    {
      label: 'KK di wilayah',
      value: d.kk.total,
      icon: House,
      to: `${home}/kk`,
    },
    {
      label: 'Belum disurvei',
      value: d.kk.belumDisurvei,
      icon: UserSearch,
      to: `${home}/survei`,
    },
    {
      label: 'Perlu revisi',
      value: d.survei.rejected,
      icon: Undo2,
      to: `${home}/survei?status=rejected`,
    },
    {
      label: 'Terverifikasi',
      value: d.survei.verified,
      icon: BadgeCheck,
      to: `${home}/survei?status=verified`,
    },
  ]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const query = useApiQuery('/dashboard')
  const dashboard = query.data?.data

  return (
    <PageTemplate
      title={`Selamat Datang, ${user.nama}`}
      description={
        user.role === 'desa'
          ? 'Ringkasan pendataan dan verifikasi calon penerima bansos seluruh desa.'
          : `Ringkasan pendataan calon penerima bansos di ${formatRt(user.rt)}.`
      }
    >
      {query.error && <Alert>{query.error.message}</Alert>}

      {dashboard && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiles(user.role, dashboard).map((tile) => (
              <StatTile
                key={tile.label}
                {...tile}
              />
            ))}
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <ActionItems
              role={user.role}
              dashboard={dashboard}
            />
            <SurveiProgressCard dashboard={dashboard} />
          </div>

          {user.role === 'desa' && (
            <section className="space-y-3">
              <h2 className="font-semibold">Progres per Wilayah RT</h2>
              <RtProgressTable perRt={dashboard.perRt} />
            </section>
          )}
        </>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <AccountInfoCard />
      </div>

      <MenuShortcuts />
    </PageTemplate>
  )
}
