import { useAuth } from '../../../auth/AuthProvider.jsx'
import { ROLE_LABELS } from '../../../auth/roles.js'
import { formatRt } from '../../../lib/format.js'
import Badge from '../../atoms/Badge.jsx'
import Card from '../../molecules/Card.jsx'
import InfoRow from '../../molecules/InfoRow.jsx'

export default function AccountInfoCard() {
  const { user } = useAuth()

  return (
    <Card title="Informasi Akun">
      <dl className="space-y-3 text-sm">
        <InfoRow label="Nama">{user.nama}</InfoRow>
        <InfoRow label="Username">{user.username}</InfoRow>
        <InfoRow label="Jabatan">
          <Badge tone="primary">{ROLE_LABELS[user.role]}</Badge>
        </InfoRow>
        <InfoRow label="Wilayah">{formatRt(user.rt)}</InfoRow>
      </dl>
    </Card>
  )
}
