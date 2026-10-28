import { useLocation, useNavigate } from 'react-router'
import { CircleCheck } from 'lucide-react'
import { useAuth } from '../../../auth/AuthProvider.jsx'
import { ROLE_LABELS } from '../../../auth/roles.js'
import Button from '../../atoms/Button.jsx'
import Modal from '../Modal.jsx'

// Shown once after login: LoginPage navigates with state { welcome: true }; closing clears it.
export default function WelcomeModal() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function close() {
    navigate(location.pathname, { replace: true, state: null })
  }

  return (
    <Modal open={Boolean(location.state?.welcome)} onClose={close} labelledBy="welcome-title">
      <form method="dialog" className="flex flex-col items-center p-6 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CircleCheck className="size-8" aria-hidden />
        </span>
        <h2 id="welcome-title" className="mt-4 text-lg font-semibold">
          Berhasil Masuk
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          Berhasil masuk sebagai <strong className="text-fg">{user.nama}</strong> dengan jabatan{' '}
          <strong className="text-fg">{ROLE_LABELS[user.role]}</strong>.
        </p>
        <Button type="submit" autoFocus className="mt-6 w-full">
          Lanjutkan
        </Button>
      </form>
    </Modal>
  )
}
