export const ROLE_LABELS = {
  desa: 'Perangkat Desa',
  rt: 'Ketua RT/RW',
}

export const ROLE_HOME = {
  desa: '/desa',
  rt: '/rt',
}

export function isRolePath(role, pathname) {
  const home = ROLE_HOME[role]
  return pathname === home || pathname.startsWith(`${home}/`)
}
