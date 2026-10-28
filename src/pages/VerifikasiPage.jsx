import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { BadgeCheck, ClipboardCheck, Clock, Eye, FileText, Search, Undo2 } from 'lucide-react'
import { ROLE_HOME } from '../auth/roles.js'
import IconButton from '../components/atoms/IconButton.jsx'
import Input from '../components/atoms/Input.jsx'
import Select from '../components/atoms/Select.jsx'
import Alert from '../components/molecules/Alert.jsx'
import Pagination from '../components/molecules/Pagination.jsx'
import Tabs from '../components/molecules/Tabs.jsx'
import DataTable from '../components/organisms/DataTable.jsx'
import RtFilter from '../components/organisms/kk/RtFilter.jsx'
import PageTemplate from '../components/templates/PageTemplate.jsx'
import { withQuery } from '../lib/api.js'
import { formatRt, formatTanggal } from '../lib/format.js'
import { useApiQuery, useDebouncedValue } from '../lib/hooks.js'
import { periodeOptions, pilihPeriode } from '../lib/periode.js'

const PAGE_SIZE = 10

// Tab per survey status; the queue (submitted) comes first and is the default.
const TABS = [
  {
    id: 'submitted',
    label: 'Menunggu Verifikasi',
    icon: Clock,
  },
  {
    id: 'rejected',
    label: 'Perlu Revisi',
    icon: Undo2,
  },
  {
    id: 'verified',
    label: 'Terverifikasi',
    icon: BadgeCheck,
  },
  {
    id: 'draft',
    label: 'Draf',
    icon: FileText,
  },
]

// Verifikasi Survei (desa): surveys submitted by the RT accounts, per periode and status.
export default function VerifikasiPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const status = TABS.some((t) => t.id === searchParams.get('status')) ? searchParams.get('status') : 'submitted'

  const periodeQuery = useApiQuery('/periode')
  const periodeList = periodeQuery.data?.data ?? []
  const [filters, setFilters] = useState({
    periodeId: '',
    rtId: '',
    q: '',
  })
  const [page, setPage] = useState(1)

  const periode = pilihPeriode(periodeList, filters.periodeId)
  const q = useDebouncedValue(filters.q.trim())

  const ringkasanQuery = useApiQuery(
    periode
      ? withQuery('/survei/ringkasan', {
          periodeId: periode.id,
          rtId: filters.rtId,
        })
      : null,
  )
  const query = useApiQuery(
    periode
      ? withQuery('/survei', {
          periodeId: periode.id,
          status,
          rtId: filters.rtId,
          q,
          page,
          limit: PAGE_SIZE,
        })
      : null,
  )
  const counts = ringkasanQuery.data?.data

  function setFilter(name) {
    return (e) => {
      setFilters((f) => ({ ...f, [name]: e.target.value }))
      setPage(1)
    }
  }

  function changeTab(id) {
    setSearchParams(id === 'submitted' ? {} : { status: id }, { replace: true })
    setPage(1)
  }

  const columns = [
    {
      key: 'kk',
      header: 'Kepala Keluarga',
      render: (s) => (
        <div>
          <p className="font-medium">{s.kk.kepalaKeluarga}</p>
          <p className="font-mono text-xs text-fg-muted">{s.kk.noKk}</p>
        </div>
      ),
    },
    {
      key: 'rt',
      header: 'Wilayah',
      className: 'whitespace-nowrap',
      render: (s) => formatRt(s.kk.rt),
    },
    {
      key: 'surveyor',
      header: 'Surveyor',
      render: (s) => s.surveyor.nama,
    },
    status === 'draft'
      ? {
          key: 'jawaban',
          header: 'Jawaban',
          className: 'text-right whitespace-nowrap',
          render: (s) => `${s.jumlahJawaban}/${s.totalPertanyaan}`,
        }
      : {
          key: 'submittedAt',
          header: 'Dikirim',
          className: 'whitespace-nowrap text-fg-muted',
          render: (s) => formatTanggal(s.submittedAt),
        },
    ...(status === 'verified' || status === 'rejected'
      ? [
          {
            key: 'verifiedAt',
            header: 'Diperiksa',
            className: 'whitespace-nowrap text-fg-muted',
            render: (s) => (
              <div>
                <p>{formatTanggal(s.verifiedAt)}</p>
                {s.verifiedBy && <p className="text-xs">{s.verifiedBy.nama}</p>}
              </div>
            ),
          },
        ]
      : []),
    {
      key: 'aksi',
      header: 'Aksi',
      className: 'text-right',
      render: (s) => (
        <div className="flex justify-end">
          <IconButton
            icon={s.status === 'submitted' ? ClipboardCheck : Eye}
            label={s.status === 'submitted' ? 'Periksa survei' : 'Lihat survei'}
            tone="primary"
            onClick={() => navigate(`${ROLE_HOME.desa}/verifikasi/${s.id}`)}
          />
        </div>
      ),
    },
  ]

  const tabs = TABS.map((t) => ({
    ...t,
    label: counts ? `${t.label} (${counts[t.id]})` : t.label,
  }))

  return (
    <PageTemplate
      title="Verifikasi Survei"
      description="Periksa survei yang dikirim Ketua RT. Hanya survei terverifikasi yang diikutkan dalam perhitungan SAW."
    >
      {!periodeQuery.loading && !periodeList.length && <Alert tone="info">Belum ada periode bansos.</Alert>}
      {periode?.status === 'final' && (
        <Alert tone="info">Periode "{periode.nama}" sudah final; survei hanya dapat dilihat.</Alert>
      )}

      {periode && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="search"
              size="sm"
              icon={Search}
              value={filters.q}
              onChange={setFilter('q')}
              placeholder="Cari No. KK atau nama kepala keluarga…"
              aria-label="Cari survei"
              className="min-w-60 flex-1"
            />
            <RtFilter
              value={filters.rtId}
              onChange={setFilter('rtId')}
            />
            <Select
              size="sm"
              value={filters.periodeId || String(periode.id)}
              onChange={setFilter('periodeId')}
              aria-label="Pilih periode"
              options={periodeOptions(periodeList)}
            />
          </div>

          <Tabs
            tabs={tabs}
            active={status}
            onChange={changeTab}
          />

          <DataTable
            columns={columns}
            rows={query.data?.data}
            loading={query.loading}
            error={query.error}
            onRetry={query.reload}
            emptyMessage={
              status === 'submitted' ? 'Tidak ada survei yang menunggu verifikasi' : 'Tidak ada survei dengan status ini'
            }
            footer={<Pagination meta={query.data?.meta} onPageChange={setPage} />}
          />
        </section>
      )}
    </PageTemplate>
  )
}
