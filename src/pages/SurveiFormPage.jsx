import { useNavigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { ROLE_HOME } from '../auth/roles.js'
import Badge from '../components/atoms/Badge.jsx'
import Button from '../components/atoms/Button.jsx'
import Spinner from '../components/atoms/Spinner.jsx'
import Alert from '../components/molecules/Alert.jsx'
import SurveiWizard from '../components/organisms/survei/SurveiWizard.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'
import { formatRt, formatTanggal } from '../lib/format.js'
import { useApiQuery } from '../lib/hooks.js'
import { STATUS_SURVEI } from '../lib/survei.js'

const LIST_PATH = `${ROLE_HOME.rt}/survei`

// /rt/survei/:id — fill in (or view) one household's survey.
export default function SurveiFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const surveiQuery = useApiQuery(`/survei/${id}`)
  const kriteriaQuery = useApiQuery('/kriteria')

  const survei = surveiQuery.data?.data
  const kriteria = kriteriaQuery.data?.data
  const error = surveiQuery.error ?? kriteriaQuery.error

  const backButton = (
    <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(LIST_PATH)}>
      Kembali
    </Button>
  )

  if (error && !survei) {
    return (
      <PageTemplate title="Survei" actions={backButton}>
        <Alert>{error.message}</Alert>
      </PageTemplate>
    )
  }

  if (!survei || !kriteria) {
    return (
      <div className="flex justify-center py-16 text-fg-muted" role="status">
        <Spinner className="size-6" />
        <span className="sr-only">Memuat survei…</span>
      </div>
    )
  }

  const status = STATUS_SURVEI[survei.status]
  const editableStatus = ['draft', 'rejected'].includes(survei.status)

  return (
    <PageTemplate
      title={`Survei ${survei.kk.kepalaKeluarga}`}
      description={`No. KK ${survei.kk.noKk} · ${formatRt(survei.kk.rt)} · ${survei.kk.alamat} · Periode ${survei.periode.nama}`}
      actions={
        <div className="flex items-center gap-3">
          <Badge tone={status.tone}>{status.label}</Badge>
          {backButton}
        </div>
      }
    >
      {survei.status === 'rejected' && (
        <Alert tone="warning">
          <strong>Survei dikembalikan untuk direvisi.</strong> Catatan perangkat desa:{' '}
          {survei.catatanVerifikasi || '(tanpa catatan)'}
        </Alert>
      )}
      {survei.status === 'submitted' && (
        <Alert tone="info">
          Survei dikirim pada {formatTanggal(survei.submittedAt)} dan sedang menunggu verifikasi perangkat desa.
        </Alert>
      )}
      {survei.status === 'verified' && (
        <Alert tone="info">
          Survei sudah diverifikasi pada {formatTanggal(survei.verifiedAt)}
          {survei.verifiedBy && ` oleh ${survei.verifiedBy.nama}`}.
        </Alert>
      )}
      {editableStatus && survei.periode.status !== 'open' && (
        <Alert tone="warning">Periode "{survei.periode.nama}" sudah ditutup; survei ini hanya dapat dilihat.</Alert>
      )}

      <SurveiWizard
        key={survei.id}
        survei={survei}
        kriteria={kriteria}
        onChanged={surveiQuery.reload}
        onSubmitted={() => navigate(LIST_PATH)}
      />
    </PageTemplate>
  )
}
