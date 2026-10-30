import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { BadgeCheck, Calculator, Search, Trophy, Users } from 'lucide-react'
import { ROLE_HOME } from '../auth/roles.js'
import Button from '../components/atoms/Button.jsx'
import Input from '../components/atoms/Input.jsx'
import Select from '../components/atoms/Select.jsx'
import Spinner from '../components/atoms/Spinner.jsx'
import Alert from '../components/molecules/Alert.jsx'
import StatTile from '../components/molecules/StatTile.jsx'
import KriteriaSawTable from '../components/organisms/perhitungan/KriteriaSawTable.jsx'
import RankingTable from '../components/organisms/perhitungan/RankingTable.jsx'
import RincianModal from '../components/organisms/perhitungan/RincianModal.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'
import { withQuery } from '../lib/api.js'
import { formatDesimal, formatTanggal } from '../lib/format.js'
import { useApiQuery } from '../lib/hooks.js'
import { ATURAN_SERI } from '../lib/perhitungan.js'
import { periodeOptions, pilihPeriode } from '../lib/periode.js'

const PERHITUNGAN_PATH = `${ROLE_HOME.desa}/perhitungan`

const KEPUTUSAN_OPTIONS = [
  {
    value: '',
    label: 'Semua keputusan',
  },
  {
    value: 'layak',
    label: 'Layak',
  },
  {
    value: 'tidak',
    label: 'Tidak layak',
  },
]

// Hasil Perangkingan (desa): the latest SAW run of a periode, or an earlier one via ?perhitungan=<id>
// (from the history on the Perhitungan page). Each row opens the per-KK breakdown.
export default function HasilPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const runParam = searchParams.get('perhitungan')
  const [periodeId, setPeriodeId] = useState('')
  const [filters, setFilters] = useState({
    q: '',
    keputusan: '',
  })
  const [rincian, setRincian] = useState(null)

  const periodeQuery = useApiQuery('/periode')
  const periodeList = periodeQuery.data?.data ?? []
  const periode = pilihPeriode(periodeList, periodeId)

  // Without ?perhitungan, find the periode's latest run first
  const runsQuery = useApiQuery(!runParam && periode ? withQuery('/perhitungan', { periodeId: periode.id }) : null)
  // While a query reloads it still holds the previous periode's data; don't show that as this one's
  const runs = runsQuery.loading ? undefined : runsQuery.data?.data
  const runId = runParam ?? runs?.[0]?.id
  const detailQuery = useApiQuery(runId ? `/perhitungan/${runId}` : null)
  const run = detailQuery.loading ? undefined : detailQuery.data?.data

  function changePeriode(e) {
    setPeriodeId(e.target.value)
    setSearchParams({}, { replace: true })
  }

  function setFilter(name) {
    return (e) => setFilters((f) => ({ ...f, [name]: e.target.value }))
  }

  const q = filters.q.trim().toLowerCase()
  const hasil = (run?.hasil ?? []).filter(
    (h) =>
      (!q || h.kk.noKk.includes(q) || h.kk.kepalaKeluarga.toLowerCase().includes(q)) &&
      (!filters.keputusan || h.layak === (filters.keputusan === 'layak')),
  )
  const batasLayak = run?.hasil.filter((h) => h.layak).at(-1)
  const noRuns = !runParam && runs?.length === 0
  const error = runsQuery.error ?? detailQuery.error

  return (
    <PageTemplate
      title="Hasil Perangkingan"
      description="Urutan KK berdasarkan nilai preferensi V. KK pada urutan teratas sesuai kuota dinyatakan layak."
      actions={
        periode && (
          <Select
            size="sm"
            value={runParam && run ? String(run.periode.id) : periodeId || String(periode.id)}
            onChange={changePeriode}
            aria-label="Pilih periode"
            options={periodeOptions(periodeList)}
          />
        )
      }
    >
      {!periodeQuery.loading && !periodeList.length && <Alert tone="info">Belum ada periode bansos.</Alert>}
      {error && <Alert>{error.message}</Alert>}

      {noRuns && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-5">
          <p className="text-sm text-fg-muted">Belum ada perhitungan SAW untuk periode {periode.nama}.</p>
          <Button
            icon={Calculator}
            onClick={() => navigate(PERHITUNGAN_PATH)}
          >
            Ke Perhitungan SAW
          </Button>
        </div>
      )}

      {runId && !run && !error && (
        <div className="flex justify-center py-16 text-fg-muted" role="status">
          <Spinner className="size-6" />
          <span className="sr-only">Memuat hasil…</span>
        </div>
      )}

      {run && (
        <>
          <p className="text-sm text-fg-muted">
            Periode <span className="font-medium text-fg">{run.periode.nama}</span> · dihitung{' '}
            {formatTanggal(run.executedAt)} oleh {run.executedBy.nama}
          </p>

          {!run.terbaru && (
            <Alert tone="info">
              Ini perhitungan lama (riwayat), bukan hasil resmi periode ini.{' '}
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => setSearchParams({}, { replace: true })}
              >
                Lihat hasil terbaru
              </button>
            </Alert>
          )}
          {run.terbaru && run.usang.length > 0 && (
            <Alert tone="warning">
              Hasil ini sudah tidak sesuai data: {run.usang.join('; ')}.{' '}
              <Link to={PERHITUNGAN_PATH} className="font-semibold underline">
                Jalankan perhitungan ulang
              </Link>
              .
            </Alert>
          )}
          {run.hasil.some((h) => h.seri) && <Alert tone="info">Ada KK dengan nilai V sama. {ATURAN_SERI}</Alert>}

          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile
              label="KK dinilai"
              value={run.jumlahAlternatif}
              icon={Users}
              hint="Survei terverifikasi saat perhitungan"
            />
            <StatTile
              label="Layak menerima"
              value={run.jumlahLayak}
              icon={BadgeCheck}
              hint={`Kuota periode ${run.periode.kuota} KK`}
            />
            <StatTile
              label="Nilai V terendah yang layak"
              value={batasLayak ? formatDesimal(batasLayak.nilaiV) : '–'}
              icon={Trophy}
              hint={batasLayak ? `Ranking ${batasLayak.ranking}` : undefined}
            />
          </div>

          <section className="space-y-3">
            <h2 className="font-semibold">Ranking</h2>
            <div className="flex flex-wrap items-center gap-3">
              <Input
                type="search"
                size="sm"
                icon={Search}
                value={filters.q}
                onChange={setFilter('q')}
                placeholder="Cari No. KK atau nama kepala keluarga…"
                aria-label="Cari KK"
                className="min-w-60 flex-1"
              />
              <Select
                size="sm"
                value={filters.keputusan}
                onChange={setFilter('keputusan')}
                aria-label="Filter keputusan"
                options={KEPUTUSAN_OPTIONS}
              />
            </div>
            <RankingTable
              hasil={hasil}
              emptyMessage="Tidak ada KK yang cocok dengan pencarian"
              onRincian={setRincian}
            />
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="font-semibold">Kriteria pada Perhitungan Ini</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Bobot, sifat, serta nilai min dan max yang dipakai saat perhitungan dijalankan.
              </p>
            </div>
            <KriteriaSawTable kriteria={run.kriteria} />
          </section>
        </>
      )}

      {rincian && (
        <RincianModal
          perhitungan={run}
          hasil={rincian}
          onClose={() => setRincian(null)}
        />
      )}
    </PageTemplate>
  )
}
