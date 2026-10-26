export const THEMES = {
  formal: {
    id: 'formal',
    name: 'Modern & Formal',
    description: 'Kesan profesional, terpercaya, dan resmi.',
    scheme: 'light',
    colors: {
      brand: '#163B65',
      primary: '#2563EB',
      primaryFg: '#FFFFFF',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceAlt: '#F1F5F9',
      border: '#E2E8F0',
      fg: '#1E293B',
      fgMuted: '#64748B',
      sidebar: '#163B65',
      sidebarFg: '#FFFFFF',
      sidebarMuted: '#B6C4D6',
      success: '#16A34A',
      warning: '#D97706',
      danger: '#EF4444',
      info: '#2563EB',
    },
  },

  clean: {
    id: 'clean',
    name: 'Light & Clean',
    description: 'Minimalis dan terang dengan aksen biru.',
    scheme: 'light',
    colors: {
      brand: '#1E3A8A',
      primary: '#2563EB',
      primaryFg: '#FFFFFF',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceAlt: '#F1F5F9',
      border: '#E2E8F0',
      fg: '#0F172A',
      fgMuted: '#64748B',
      sidebar: '#FFFFFF',
      sidebarFg: '#334155',
      sidebarMuted: '#64748B',
      success: '#16A34A',
      warning: '#D97706',
      danger: '#EF4444',
      info: '#2563EB',
    },
  },

  fresh: {
    id: 'fresh',
    name: 'Minimalis & Fresh',
    description: 'Ramah, bersih, dan mudah digunakan.',
    scheme: 'light',
    colors: {
      brand: '#059669',
      primary: '#10B981',
      primaryFg: '#FFFFFF',
      background: '#F1F7F5',
      surface: '#FFFFFF',
      surfaceAlt: '#F6FAF8',
      border: '#E2ECE7',
      fg: '#1F2937',
      fgMuted: '#6B7280',
      sidebar: '#FFFFFF',
      sidebarFg: '#374151',
      sidebarMuted: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#2563EB',
    },
  },

  dark: {
    id: 'dark',
    name: 'Modern Dark Mode',
    description: 'Modern, fokus, dan nyaman untuk penggunaan lama.',
    scheme: 'dark',
    colors: {
      brand: '#3B82F6',
      primary: '#3B82F6',
      primaryFg: '#FFFFFF',
      background: '#0F172A',
      surface: '#1E293B',
      surfaceAlt: '#273549',
      border: '#334155',
      fg: '#F1F5F9',
      fgMuted: '#94A3B8',
      sidebar: '#0B1222',
      sidebarFg: '#E2E8F0',
      sidebarMuted: '#94A3B8',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
    },
  },
}

export const THEME_LIST = Object.values(THEMES)

export const DEFAULT_THEME_ID = 'formal'

export const THEME_STORAGE_KEY = 'spk-bansos:theme'

export function themeVar(token) {
  return `--theme-${token.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`
}

export function applyTheme(themeId) {
  const theme = THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID]
  const root = document.documentElement
  for (const [token, value] of Object.entries(theme.colors)) {
    root.style.setProperty(themeVar(token), value)
  }
  root.style.colorScheme = theme.scheme
  root.dataset.theme = theme.id
}

export function loadThemeId() {
  try {
    const id = localStorage.getItem(THEME_STORAGE_KEY)
    return id in THEMES ? id : DEFAULT_THEME_ID
  } catch {
    return DEFAULT_THEME_ID
  }
}

export function saveThemeId(themeId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId)
  } catch {}
}
