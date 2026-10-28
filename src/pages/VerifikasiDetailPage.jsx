import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, BadgeCheck, Undo2 } from 'lucide-react'
import { ROLE_HOME } from '../auth/roles.js'
import Badge from '../components/atoms/Badge.jsx'
import Button from '../components/atoms/Button.jsx'
import Spinner from '../components/atoms/Spinner.jsx'
import Alert from '../components/molecules/Alert.jsx'
import Card from '../components/molecules/Card.jsx'
import InfoRow from '../components/molecules/InfoRow.jsx'
import { useToast } from '../components/organisms/Toast.jsx'
import FotoGallery from '../components/organisms/verifikasi/FotoGallery.jsx'
import JawabanReview from '../components/organisms/verifikasi/JawabanReview.jsx'
import VerifikasiFormModal from '../components/organisms/verifikasi/VerifikasiFormModal.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'
import { formatRt, formatTanggal } from '../lib/format.js'
import { useApiQuery } from '../lib/hooks.js'
import { STATUS_SURVEI } from '../lib/survei.js'

const LIST_PATH = `${ROLE_HOME.desa}/verifikasi`

// /desa/verifikasi/:id — review one survey and verify it or send it back for revision.
export default function VerifikasiDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const surveiQuery = useApiQuery(`/survei/${id}`)
  const kriteriaQuery = useApiQuery('/kriteria')
  // 'verified' | 'rejected' while the decision dialog is open
  const [decision, setDecision] = useState(null)

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
      <PageTemplate title="Verifikasi Survei" actions={backButton}>
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
  const canDecide = survei.status === 'submitted' && survei.periode.status !== 'final'

  function decided(saved) {
    toast.success(
      saved.status === 'verified'
        ? `Survei ${saved.kk.kepalaKeluarga} terverifikasi`
        : `Survei ${saved.kk.kepalaKeluarga} dikembalikan untuk revisi`,
    )
    navigate(LIST_PATH)
  }

  return (
    <PageTemplate
      title={`Survei ${survei.kk.kepalaKeluarga}`}
      description={`No. KK ${survei.kk.noKk} · ${formatRt(survei.kk.rt)} · Periode ${survei.periode.nama}`}
      actions={
        <div className="flex items-center gap-3">
          <Badge tone={status.tone}>{status.label}</Badge>
          {backButton}
        </div>
      }
    >
      {survei.status === 'submitted' && survei.catatanVerifikasi && (
        <Alert tone="info">
          Survei ini dikirim ulang setelah revisi. Catatan sebelumnya: {survei.catatanVerifikasi}
        </Alert>
      )}
      {survei.status === 'rejected' && (
        <Alert tone="warning">
          Dikembalikan untuk revisi
          {survei.verifiedBy && ` oleh ${survei.verifiedBy.nama}`} pada {formatTanggal(survei.verifiedAt)}. Catatan:{' '}
          {survei.catatanVerifikasi}
        </Alert>
      )}
      {survei.status === 'draft' && (
        <Alert tone="info">Survei masih berupa draf dan belum dikirim oleh Ketua RT.</Alert>
      )}

      {canDecide && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm">
            Periksa jawaban dan foto di bawah, lalu tentukan apakah survei sudah sesuai dengan kondisi lapangan.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" icon={Undo2} onClick={() => setDecision('rejected')}>
              Kembalikan untuk Revisi
            </Button>
            <Button icon={BadgeCheck} onClick={() => setDecision('verified')}>
              Verifikasi
            </Button>
          </div>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <JawabanReview
            kriteria={kriteria}
            jawaban={survei.jawaban}
          />
        </div>
        <div className="space-y-6">
          <Card title="Data Keluarga">
            <dl className="space-y-3 text-sm">
              <InfoRow label="No. KK">
                <span className="font-mono">{survei.kk.noKk}</span>
              </InfoRow>
              <InfoRow label="Kepala keluarga">{survei.kk.kepalaKeluarga}</InfoRow>
              <InfoRow label="Alamat">{survei.kk.alamat}</InfoRow>
              <InfoRow label="Wilayah">{formatRt(survei.kk.rt)}</InfoRow>
              <InfoRow label="Anggota keluarga">{survei.kk.jumlahAnggota} orang</InfoRow>
              <InfoRow label="Surveyor">{survei.surveyor.nama}</InfoRow>
              <InfoRow label="Dikirim">{formatTanggal(survei.submittedAt)}</InfoRow>
              {survei.verifiedAt && (
                <InfoRow label="Diperiksa">
                  {formatTanggal(survei.verifiedAt)}
                  {survei.verifiedBy && <span className="block text-xs text-fg-muted">{survei.verifiedBy.nama}</span>}
                </InfoRow>
              )}
            </dl>
          </Card>
          <FotoGallery survei={survei} />
        </div>
      </div>

      {decision && (
        <VerifikasiFormModal
          survei={survei}
          decision={decision}
          onClose={() => setDecision(null)}
          onSaved={decided}
        />
      )}
    </PageTemplate>
  )
}
