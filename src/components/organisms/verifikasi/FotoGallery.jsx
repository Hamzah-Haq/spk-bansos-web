import { ImageOff } from 'lucide-react'
import { JENIS_FOTO, fotoUrl } from '../../../lib/survei.js'
import Card from '../../molecules/Card.jsx'

// Read-only field photos of a survey; click one to open it full size in a new tab.
export default function FotoGallery({ survei }) {
  const byJenis = Object.fromEntries(survei.foto.map((f) => [f.jenis, f]))

  return (
    <Card
      title="Foto Lapangan"
      description={`${survei.foto.length} dari ${JENIS_FOTO.length} foto diunggah`}
    >
      <div className="grid grid-cols-2 gap-3">
        {JENIS_FOTO.map(({ jenis, label }) => {
          const foto = byJenis[jenis]
          return (
            <figure key={jenis} className="overflow-hidden rounded-lg border border-border">
              {foto ? (
                <a href={fotoUrl(survei.id, foto.id)} target="_blank" rel="noreferrer" className="block aspect-video">
                  <img
                    src={fotoUrl(survei.id, foto.id)}
                    alt={label}
                    loading="lazy"
                    className="size-full object-cover transition hover:opacity-90"
                  />
                </a>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-1 bg-surface-alt text-fg-muted">
                  <ImageOff className="size-5" aria-hidden />
                  <span className="text-xs">Tidak ada foto</span>
                </div>
              )}
              <figcaption className="px-2 py-1.5 text-xs font-medium">{label}</figcaption>
            </figure>
          )
        })}
      </div>
    </Card>
  )
}
