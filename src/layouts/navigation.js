import {
  Calculator,
  ClipboardCheck,
  ClipboardList,
  FileText,
  House,
  LayoutGrid,
  Settings,
  Trophy,
  UserCog,
  Users,
} from 'lucide-react'

export const NAV = {
  desa: [
    { path: '', label: 'Dashboard', icon: House },
    { path: 'warga', label: 'Data Warga', icon: Users },
    { path: 'kriteria', label: 'Data Kriteria', icon: LayoutGrid },
    { path: 'verifikasi', label: 'Verifikasi Survei', icon: ClipboardCheck },
    { path: 'perhitungan', label: 'Perhitungan SAW', icon: Calculator },
    { path: 'hasil', label: 'Hasil Perangkingan', icon: Trophy },
    { path: 'laporan', label: 'Laporan', icon: FileText },
    { path: 'akun-rt', label: 'Akun RT', icon: UserCog },
    { path: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ],
  rt: [
    { path: '', label: 'Dashboard', icon: House },
    { path: 'kk', label: 'Data KK', icon: Users },
    { path: 'survei', label: 'Survei', icon: ClipboardList },
    { path: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ],
}
