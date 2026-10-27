import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import Button, { IconButton } from '../../components/Button.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import DataTable from '../../components/DataTable.jsx'
import { TextField } from '../../components/FormField.jsx'
import FormModal from '../../components/FormModal.jsx'
import { useToast } from '../../components/Toast.jsx'
import { api } from '../../lib/api.js'
import { formatRt } from '../../lib/format.js'
import { useApiQuery, useForm } from '../../lib/hooks.js'

export default function RtPanel() {
  const toast = useToast()
  const query = useApiQuery('/rt')
  // { type: 'create' | 'edit' | 'delete', rt? }
  const [dialog, setDialog] = useState(null)

  function done(message) {
    toast.success(message)
    setDialog(null)
    query.reload()
  }

  async function deleteRt(rt) {
    await api(`/rt/${rt.id}`, { method: 'DELETE' })
    done(`${formatRt(rt)} berhasil dihapus`)
  }

  const columns = [
    {
      key: 'noRt',
      header: 'No. RT',
      className: 'font-medium',
    },
    {
      key: 'noRw',
      header: 'No. RW',
    },
    {
      key: 'jumlahAkun',
      header: 'Akun',
      className: 'text-right',
    },
    {
      key: 'jumlahKk',
      header: 'Kartu Keluarga',
      className: 'text-right',
    },
    {
      key: 'aksi',
      header: 'Aksi',
      className: 'text-right',
      render: (rt) => {
        const used = rt.jumlahAkun > 0 || rt.jumlahKk > 0
        return (
          <div className="flex justify-end gap-1">
            <IconButton
              icon={Pencil}
              label="Ubah wilayah"
              tone="primary"
              onClick={() => setDialog({ type: 'edit', rt })}
            />
            <IconButton
              icon={Trash2}
              label={used ? 'Masih memiliki akun atau KK' : 'Hapus wilayah'}
              tone="danger"
              disabled={used}
              onClick={() => setDialog({ type: 'delete', rt })}
            />
          </div>
        )
      },
    },
  ]

  const target = dialog?.rt

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">
          Wilayah yang masih memiliki akun atau Kartu Keluarga tidak dapat dihapus.
        </p>
        <Button icon={Plus} onClick={() => setDialog({ type: 'create' })}>
          Tambah Wilayah
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={query.data?.data}
        loading={query.loading}
        error={query.error}
        onRetry={query.reload}
        emptyMessage="Belum ada wilayah RT"
      />

      {(dialog?.type === 'create' || dialog?.type === 'edit') && (
        <RtFormModal
          rt={target}
          onClose={() => setDialog(null)}
          onSaved={(saved) => done(`${formatRt(saved)} berhasil ${target ? 'diperbarui' : 'ditambahkan'}`)}
        />
      )}

      {dialog?.type === 'delete' && (
        <ConfirmDialog
          title="Hapus Wilayah RT"
          confirmLabel="Hapus"
          message={
            <>
              Hapus <strong className="text-fg">{formatRt(target)}</strong>?
            </>
          }
          onConfirm={() => deleteRt(target)}
          onClose={() => setDialog(null)}
        />
      )}
    </section>
  )
}

function RtFormModal({ rt, onClose, onSaved }) {
  const form = useForm({
    noRt: rt?.noRt ?? '',
    noRw: rt?.noRw ?? '',
  })

  function validate(v) {
    const errors = {}
    if (!/^\d{1,3}$/.test(v.noRt.trim())) errors.noRt = 'No. RT berupa 1–3 digit angka'
    if (!/^\d{1,3}$/.test(v.noRw.trim())) errors.noRw = 'No. RW berupa 1–3 digit angka'
    return errors
  }

  function save() {
    return form.submit(async (v) => {
      const body = {
        noRt: v.noRt.trim(),
        noRw: v.noRw.trim(),
      }
      const { data } = rt
        ? await api(`/rt/${rt.id}`, { method: 'PATCH', body })
        : await api('/rt', { method: 'POST', body })
      onSaved(data)
    }, validate)
  }

  return (
    <FormModal
      title={rt ? 'Ubah Wilayah RT' : 'Tambah Wilayah RT'}
      description="Nomor otomatis disimpan 3 digit, misalnya 4 menjadi 004."
      onClose={onClose}
      onSubmit={save}
      submitting={form.submitting}
      error={form.error}
    >
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="noRt"
          label="No. RT"
          inputMode="numeric"
          maxLength={3}
          placeholder="001"
          autoFocus
          {...form.field('noRt')}
        />
        <TextField
          id="noRw"
          label="No. RW"
          inputMode="numeric"
          maxLength={3}
          placeholder="001"
          {...form.field('noRw')}
        />
      </div>
    </FormModal>
  )
}
