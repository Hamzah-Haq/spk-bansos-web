import { useState } from 'react'
import { BadgeCheck, Lock, LockOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import Alert from '../../components/Alert.jsx'
import Badge from '../../components/Badge.jsx'
import Button, { IconButton } from '../../components/Button.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import DataTable from '../../components/DataTable.jsx'
import { TextField } from '../../components/FormField.jsx'
import FormModal from '../../components/FormModal.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { useToast } from '../../components/Toast.jsx'
import { api } from '../../lib/api.js'
import { useApiQuery, useForm } from '../../lib/hooks.js'

const CURRENT_YEAR = new Date().getFullYear()

const PERIODE_STATUS = {
  open: {
    label: 'Dibuka',
    tone: 'success',
  },
  closed: {
    label: 'Ditutup',
    tone: 'warning',
  },
  final: {
    label: 'Final',
    tone: 'primary',
  },
}

// Confirmation text per target status (backend allows open ⇄ closed → final)
const STATUS_ACTIONS = {
  closed: {
    title: 'Tutup Periode',
    confirmLabel: 'Tutup Periode',
    tone: 'primary',
    message: 'Ketua RT tidak dapat lagi membuat atau mengirim survei untuk periode ini. Periode dapat dibuka kembali.',
    toast: 'ditutup',
  },
  open: {
    title: 'Buka Kembali Periode',
    confirmLabel: 'Buka Kembali',
    tone: 'primary',
    message: 'Ketua RT dapat kembali membuat dan mengirim survei untuk periode ini.',
    toast: 'dibuka kembali',
  },
  final: {
    title: 'Finalkan Periode',
    confirmLabel: 'Finalkan',
    tone: 'danger',
    message:
      'Periode yang sudah final dikunci: nama, kuota, dan statusnya tidak dapat diubah lagi, dan periode tidak ' +
      'dapat dihapus. Tindakan ini tidak dapat dibatalkan.',
    toast: 'difinalkan',
  },
}

export default function PeriodePage() {
  const toast = useToast()
  const query = useApiQuery('/periode')
  // { type: 'create' | 'edit' | 'status' | 'delete', periode?, status? }
  const [dialog, setDialog] = useState(null)

  function done(message) {
    toast.success(message)
    setDialog(null)
    query.reload()
  }

  async function changeStatus(periode, status) {
    await api(`/periode/${periode.id}/status`, { method: 'PATCH', body: { status } })
    done(`Periode "${periode.nama}" berhasil ${STATUS_ACTIONS[status].toast}`)
  }

  async function deletePeriode(periode) {
    await api(`/periode/${periode.id}`, { method: 'DELETE' })
    done(`Periode "${periode.nama}" berhasil dihapus`)
  }

  const rows = query.data?.data
  const openPeriode = rows?.find((p) => p.status === 'open')

  const columns = [
    {
      key: 'nama',
      header: 'Nama Periode',
      className: 'font-medium',
    },
    {
      key: 'tahun',
      header: 'Tahun',
    },
    {
      key: 'kuota',
      header: 'Kuota',
      className: 'text-right',
      render: (p) => `${p.kuota} KK`,
    },
    {
      key: 'jumlahSurvei',
      header: 'Survei',
      className: 'text-right',
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => <Badge tone={PERIODE_STATUS[p.status].tone}>{PERIODE_STATUS[p.status].label}</Badge>,
    },
    {
      key: 'aksi',
      header: 'Aksi',
      className: 'text-right',
      render: (p) => {
        const final = p.status === 'final'
        const used = p.jumlahSurvei > 0 || p.jumlahPerhitungan > 0
        const otherOpen = openPeriode && openPeriode.id !== p.id
        return (
          <div className="flex justify-end gap-1">
            <IconButton
              icon={Pencil}
              label={final ? 'Periode final tidak dapat diubah' : 'Ubah periode'}
              tone="primary"
              disabled={final}
              onClick={() => setDialog({ type: 'edit', periode: p })}
            />
            {p.status === 'open' && (
              <IconButton
                icon={Lock}
                label="Tutup periode"
                tone="warning"
                onClick={() => setDialog({ type: 'status', periode: p, status: 'closed' })}
              />
            )}
            {p.status === 'closed' && (
              <>
                <IconButton
                  icon={LockOpen}
                  label={otherOpen ? `Tutup "${openPeriode.nama}" terlebih dahulu` : 'Buka kembali'}
                  tone="success"
                  disabled={otherOpen}
                  onClick={() => setDialog({ type: 'status', periode: p, status: 'open' })}
                />
                <IconButton
                  icon={BadgeCheck}
                  label="Finalkan periode"
                  tone="primary"
                  onClick={() => setDialog({ type: 'status', periode: p, status: 'final' })}
                />
              </>
            )}
            <IconButton
              icon={Trash2}
              label={final || used ? 'Periode sudah memiliki survei atau sudah final' : 'Hapus periode'}
              tone="danger"
              disabled={final || used}
              onClick={() => setDialog({ type: 'delete', periode: p })}
            />
          </div>
        )
      },
    },
  ]

  const target = dialog?.periode

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        title="Periode Bansos"
        description="Setiap KK hanya dapat disurvei dan menerima bantuan satu kali dalam satu periode."
        actions={
          <Button
            icon={Plus}
            disabled={Boolean(openPeriode)}
            title={openPeriode ? `Tutup periode "${openPeriode.nama}" terlebih dahulu` : undefined}
            onClick={() => setDialog({ type: 'create' })}
          >
            Tambah Periode
          </Button>
        }
      />

      <Alert tone="info">
        Hanya satu periode yang dapat berstatus <strong>Dibuka</strong>. Survei baru dari Ketua RT masuk ke periode
        tersebut. Tutup periode sebelum perhitungan SAW, lalu finalkan setelah hasil perangkingan ditetapkan.
      </Alert>

      <DataTable
        columns={columns}
        rows={rows}
        loading={query.loading}
        error={query.error}
        onRetry={query.reload}
        emptyMessage="Belum ada periode"
      />

      {(dialog?.type === 'create' || dialog?.type === 'edit') && (
        <PeriodeFormModal
          periode={target}
          onClose={() => setDialog(null)}
          onSaved={(saved) => done(`Periode "${saved.nama}" berhasil ${target ? 'diperbarui' : 'ditambahkan'}`)}
        />
      )}

      {dialog?.type === 'status' && (
        <ConfirmDialog
          title={STATUS_ACTIONS[dialog.status].title}
          confirmLabel={STATUS_ACTIONS[dialog.status].confirmLabel}
          tone={STATUS_ACTIONS[dialog.status].tone}
          message={
            <>
              <strong className="text-fg">{target.nama}</strong>. {STATUS_ACTIONS[dialog.status].message}
            </>
          }
          onConfirm={() => changeStatus(target, dialog.status)}
          onClose={() => setDialog(null)}
        />
      )}

      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title="Hapus Periode"
          confirmLabel="Hapus"
          message={
            <>
              Hapus periode <strong className="text-fg">{target.nama}</strong>?
            </>
          }
          onConfirm={() => deletePeriode(target)}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}

function PeriodeFormModal({ periode, onClose, onSaved }) {
  const form = useForm({
    nama: periode?.nama ?? '',
    tahun: String(periode?.tahun ?? CURRENT_YEAR),
    kuota: periode ? String(periode.kuota) : '',
  })

  function validate(v) {
    const errors = {}
    if (!v.nama.trim()) errors.nama = 'Nama periode wajib diisi'
    if (!/^\d{4}$/.test(v.tahun)) errors.tahun = 'Tahun berupa 4 digit angka'
    if (!/^\d+$/.test(v.kuota) || Number(v.kuota) < 1) errors.kuota = 'Kuota minimal 1 KK'
    return errors
  }

  function save() {
    return form.submit(async (v) => {
      const body = {
        nama: v.nama.trim(),
        tahun: Number(v.tahun),
        kuota: Number(v.kuota),
      }
      const { data } = periode
        ? await api(`/periode/${periode.id}`, { method: 'PATCH', body })
        : await api('/periode', { method: 'POST', body })
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={periode ? 'Ubah Periode' : 'Tambah Periode'}
      description={periode ? undefined : 'Periode baru langsung berstatus Dibuka.'}
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      <TextField
        id="nama"
        label="Nama periode"
        placeholder="contoh: BLT Dana Desa Tahap 1"
        autoFocus
        {...form.field('nama')}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="tahun"
          label="Tahun"
          inputMode="numeric"
          maxLength={4}
          {...form.field('tahun')}
        />
        <TextField
          id="kuota"
          label="Kuota penerima (KK)"
          inputMode="numeric"
          hint="Peringkat 1 sampai kuota dinyatakan layak."
          {...form.field('kuota')}
        />
      </div>
    </FormModal>
  )
}
