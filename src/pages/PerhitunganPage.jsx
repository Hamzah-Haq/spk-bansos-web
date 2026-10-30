import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Calculator, Eye } from 'lucide-react'
import { ROLE_HOME } from '../auth/roles.js'
import Badge from '../components/atoms/Badge.jsx'
import Button from '../components/atoms/Button.jsx'
import IconButton from '../components/atoms/IconButton.jsx'
import Select from '../components/atoms/Select.jsx'
import Alert from '../components/molecules/Alert.jsx'
import ConfirmDialog from '../components/organisms/ConfirmDialog.jsx'
import DataTable from '../components/organisms/DataTable.jsx'
import KesiapanCard from '../components/organisms/perhitungan/KesiapanCard.jsx'
import KriteriaSawTable from '../components/organisms/perhitungan/KriteriaSawTable.jsx'
import { useToast } from '../components/organisms/Toast.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'
import { api, withQuery } from '../lib/api.js'
import { formatTanggal } from '../lib/format.js'
import { useApiQuery } from '../lib/hooks.js'
import { kesiapanPerhitungan } from '../lib/perhitungan.js'
import { periodeOptions, pilihPeriode } from '../lib/periode.js'

const HASIL_PATH = `${ROLE_HOME.desa}/hasil`

// Perhitungan SAW (desa): check readiness, run SAW for a periode, and see earlier runs.
export default function PerhitunganPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [periodeId, setPeriodeId] = useState('')
  const [confirming, setConfirming] = useState(false)

  const periodeQuery = useApiQuery('/periode')
  const periodeList = periodeQuery.data?.data ?? []
  const periode = pilihPeriode(periodeList, periodeId)

  const kriteriaQuery = useApiQuery('/kriteria')
  const ringkasanQuery = useApiQuery(periode ? withQuery('/survei/ringkasan', { periodeId: periode.id }) : null)
  const runsQuery = useApiQuery(periode ? withQuery('/perhitungan', { periodeId: periode.id }) : null)

  const ringkasan = ringkasanQuery.data?.data
  const totalBobot = kriteriaQuery.data?.meta.totalBobot
  const kesiapan =
    periode && ringkasan && totalBobot != null
      ? kesiapanPerhitungan({
          periode,
          ringkasan,
          totalBobot,
        })
      : null

  async function run() {
    const { data } = await api('/perhitungan', {
      method: 'POST',
      body: { periodeId: periode.id },
    })
    toast.success(`Perhitungan SAW selesai: ${data.jumlahAlternatif} KK diperingkat`)
    navigate(`${HASIL_PATH}?perhitungan=${data.id}`)
  }

  const runColumns = [
    {
      key: 'executedAt',
      header: 'Waktu',
      className: 'whitespace-nowrap',
      render: (p) => formatTanggal(p.executedAt),
    },
    {
      key: 'executedBy',
      header: 'Dijalankan oleh',
      render: (p) => p.executedBy.nama,
    },
    {
      key: 'jumlahAlternatif',
      header: 'KK dinilai',
      className: 'text-right',
    },
    {
      key: 'jumlahLayak',
      header: 'Layak',
      className: 'text-right',
    },
    {
      key: 'terbaru',
      header: 'Status',
      render: (p) => (p.terbaru ? <Badge tone="primary">Terbaru</Badge> : <Badge>Riwayat</Badge>),
    },
    {
      key: 'aksi',
      header: 'Aksi',
      className: 'text-right',
      render: (p) => (
        <div className="flex justify-end">
          <IconButton
            icon={Eye}
            label="Lihat hasil"
            tone="primary"
            onClick={() => navigate(`${HASIL_PATH}?perhitungan=${p.id}`)}
          />
        </div>
      ),
    },
  ]

  const error = ringkasanQuery.error ?? kriteriaQuery.error

  return (
    <PageTemplate
      title="Perhitungan SAW"
      description="Hitung nilai preferensi setiap KK dengan metode Simple Additive Weighting dan simpan hasilnya."
      actions={
        periode && (
          <Select
            size="sm"
            value={periodeId || String(periode.id)}
            onChange={(e) => setPeriodeId(e.target.value)}
            aria-label="Pilih periode"
            options={periodeOptions(periodeList)}
          />
        )
      }
    >
      {!periodeQuery.loading && !periodeList.length && <Alert tone="info">Belum ada periode bansos.</Alert>}
      {error && <Alert>{error.message}</Alert>}

      {kesiapan && (
        <KesiapanCard
          items={kesiapan.items}
          actions={
            <Button
              icon={Calculator}
              disabled={!kesiapan.siap}
              onClick={() => setConfirming(true)}
            >
              Jalankan Perhitungan
            </Button>
          }
        />
      )}

      {periode && (
        <>
          <section className="space-y-3">
            <div>
              <h2 className="font-semibold">Kriteria & Bobot Saat Ini</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Nilai ini disalin ke setiap perhitungan, sehingga hasil lama tetap dapat dijelaskan walau bobot diubah.
              </p>
            </div>
            <KriteriaSawTable
              kriteria={kriteriaQuery.data?.data}
              loading={kriteriaQuery.loading}
              error={kriteriaQuery.error}
              onRetry={kriteriaQuery.reload}
            />
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="font-semibold">Riwayat Perhitungan</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Setiap perhitungan disimpan. Perhitungan terbaru menjadi hasil resmi periode ini.
              </p>
            </div>
            <DataTable
              columns={runColumns}
              rows={runsQuery.data?.data}
              loading={runsQuery.loading}
              error={runsQuery.error}
              onRetry={runsQuery.reload}
              emptyMessage="Belum ada perhitungan untuk periode ini"
            />
          </section>
        </>
      )}

      {confirming && (
        <ConfirmDialog
          title="Jalankan Perhitungan SAW"
          confirmLabel="Jalankan"
          tone="primary"
          message={
            <>
              <p>
                SAW akan menghitung <strong className="text-fg">{ringkasan.verified} KK terverifikasi</strong> pada
                periode <strong className="text-fg">{periode.nama}</strong> dengan bobot dan sifat kriteria saat ini.
                Hasilnya disimpan sebagai riwayat dan tidak dapat dihapus.
              </p>
              {ringkasan.submitted > 0 && (
                <p className="mt-2 text-warning">
                  {ringkasan.submitted} survei yang masih menunggu verifikasi tidak ikut dihitung.
                </p>
              )}
            </>
          }
          onConfirm={run}
          onClose={() => setConfirming(false)}
        />
      )}
    </PageTemplate>
  )
}
