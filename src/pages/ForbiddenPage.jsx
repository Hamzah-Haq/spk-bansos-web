import { ShieldX } from 'lucide-react'
import StatusTemplate from '../components/templates/StatusTemplate.jsx'

export default function ForbiddenPage() {
  return (
    <StatusTemplate
      icon={ShieldX}
      code="403"
      message="Anda tidak memiliki akses ke halaman ini."
    />
  )
}
