// Display data for surveys; the rules themselves are enforced by the API.

export const STATUS_SURVEI = {
  draft: {
    label: 'Draf',
    tone: 'neutral',
  },
  submitted: {
    label: 'Menunggu Verifikasi',
    tone: 'info',
  },
  verified: {
    label: 'Terverifikasi',
    tone: 'success',
  },
  rejected: {
    label: 'Perlu Revisi',
    tone: 'danger',
  },
}

export const STATUS_SURVEI_OPTIONS = Object.entries(STATUS_SURVEI).map(([value, { label }]) => ({ value, label }))

// Same order and keys as the API's JenisFoto enum; one photo per jenis
export const JENIS_FOTO = [
  {
    jenis: 'depan',
    label: 'Tampak depan rumah',
  },
  {
    jenis: 'lantai',
    label: 'Lantai',
  },
  {
    jenis: 'dinding',
    label: 'Dinding',
  },
  {
    jenis: 'atap',
    label: 'Atap',
  },
  {
    jenis: 'jamban',
    label: 'Jamban / WC',
  },
  {
    jenis: 'air',
    label: 'Sumber air',
  },
]

export const FOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_FOTO_BYTES = 5 * 1024 * 1024

// Served by the API only to logged-in users allowed to see the survey (cookie sent same-origin)
export function fotoUrl(surveiId, fotoId) {
  return `/api/survei/${surveiId}/foto/${fotoId}`
}
