import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { api } from '../../../lib/api.js'
import { formatRt } from '../../../lib/format.js'
import { useApiQuery } from '../../../lib/hooks.js'
import Button from '../../atoms/Button.jsx'
import IconButton from '../../atoms/IconButton.jsx'
import ConfirmDialog from '../ConfirmDialog.jsx'
import DataTable from '../DataTable.jsx'
import { useToast } from '../Toast.jsx'
import RtFormModal from './RtFormModal.jsx'

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
