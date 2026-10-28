// Shared by pages that work on one periode at a time (Survei, Verifikasi).

// The chosen periode, or by default the open one, else the newest (the API lists newest first).
export function pilihPeriode(list, selectedId) {
  if (selectedId) return list.find((p) => String(p.id) === String(selectedId))
  return list.find((p) => p.status === 'open') ?? list[0]
}

export function periodeOptions(list) {
  return list.map((p) => ({
    value: String(p.id),
    label: `${p.nama}${p.status === 'open' ? ' (dibuka)' : ''}`,
  }))
}
