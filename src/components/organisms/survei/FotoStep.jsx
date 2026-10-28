import { useRef, useState } from 'react'
import { ImagePlus, RefreshCw, Trash2 } from 'lucide-react'
import { api } from '../../../lib/api.js'
import { FOTO_TYPES, JENIS_FOTO, MAX_FOTO_BYTES, fotoUrl } from '../../../lib/survei.js'
import Button from '../../atoms/Button.jsx'
import Alert from '../../molecules/Alert.jsx'
import ConfirmDialog from '../ConfirmDialog.jsx'
import { useToast } from '../Toast.jsx'

// Field photos, one slot per jenis. Uploading into a filled slot replaces that photo.
export default function FotoStep({ survei, readOnly, onChanged }) {
  const toast = useToast()
  const [uploading, setUploading] = useState(null)
  const [error, setError] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const byJenis = Object.fromEntries(survei.foto.map((f) => [f.jenis, f]))

  async function upload(jenis, file) {
    setError(null)
    if (!FOTO_TYPES.includes(file.type)) return setError('File harus berupa foto JPEG, PNG, atau WebP')
    if (file.size > MAX_FOTO_BYTES) return setError('Ukuran foto maksimal 5 MB')

    const body = new FormData()
    body.append('jenis', jenis)
    body.append('file', file)
    setUploading(jenis)
    try {
      await api(`/survei/${survei.id}/foto`, { method: 'POST', body })
      toast.success('Foto berhasil diunggah')
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(null)
    }
  }

  async function remove(foto) {
    await api(`/survei/${survei.id}/foto/${foto.id}`, { method: 'DELETE' })
    toast.success('Foto berhasil dihapus')
    setToDelete(null)
    onChanged()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-fg-muted">
        Foto kondisi rumah sebagai bukti untuk verifikasi oleh perangkat desa. Format JPEG, PNG, atau WebP, maksimal
        5 MB per foto.
      </p>
      {error && <Alert>{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {JENIS_FOTO.map(({ jenis, label }) => (
          <FotoSlot
            key={jenis}
            label={label}
            foto={byJenis[jenis]}
            surveiId={survei.id}
            readOnly={readOnly}
            uploading={uploading === jenis}
            busy={Boolean(uploading)}
            onPick={(file) => upload(jenis, file)}
            onDelete={() => setToDelete(byJenis[jenis])}
          />
        ))}
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Hapus Foto"
          confirmLabel="Hapus"
          message={`Hapus foto ${JENIS_FOTO.find((j) => j.jenis === toDelete.jenis).label.toLowerCase()}?`}
          onConfirm={() => remove(toDelete)}
          onClose={() => setToDelete(null)}
        />
      )}
    </div>
  )
}

function FotoSlot({ label, foto, surveiId, readOnly, uploading, busy, onPick, onDelete }) {
  const inputRef = useRef(null)

  function handleChange(e) {
    const file = e.target.files?.[0]
    // Reset so picking the same file again still fires change
    e.target.value = ''
    if (file) onPick(file)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex aspect-video items-center justify-center bg-surface-alt">
        {foto ? (
          <a href={fotoUrl(surveiId, foto.id)} target="_blank" rel="noreferrer" className="size-full">
            <img
              src={fotoUrl(surveiId, foto.id)}
              alt={label}
              loading="lazy"
              className="size-full object-cover"
            />
          </a>
        ) : (
          <ImagePlus className="size-8 text-fg-muted" aria-hidden />
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{label}</p>
          <p className="text-xs text-fg-muted">{foto ? `${Math.ceil(foto.sizeBytes / 1024)} KB` : 'Belum ada foto'}</p>
        </div>
        {!readOnly && (
          <div className="flex shrink-0 gap-1">
            {foto && (
              <Button
                size="sm"
                variant="secondary"
                icon={Trash2}
                disabled={busy}
                aria-label={`Hapus foto ${label}`}
                onClick={onDelete}
              />
            )}
            <Button
              size="sm"
              variant={foto ? 'secondary' : 'primary'}
              icon={foto ? RefreshCw : ImagePlus}
              loading={uploading}
              disabled={busy && !uploading}
              onClick={() => inputRef.current.click()}
            >
              {foto ? 'Ganti' : 'Unggah'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept={FOTO_TYPES.join(',')}
              onChange={handleChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}
