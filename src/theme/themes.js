// Color themes from the team's design samples. The user picks one (saved per browser);
// ThemeProvider writes the active theme's colors as --theme-* CSS variables, which
// index.css maps to Tailwind colors: bg-primary, text-fg-muted, border-border, bg-success/10, ...
//
// Token roles (same keys in every theme):
//   brand          identity color: logo, headings accent
//   primary        interactive: buttons, active nav item, links, focus ring
//   primaryFg      text/icons on primary
//   background     page background
//   surface        cards, tables, inputs
//   surfaceAlt     table headers, hover rows, subtle fills
//   border         dividers and input borders
//   fg / fgMuted   main text / secondary text
//   sidebar*       desa sidebar background, text, inactive icon/text
//   success/warning/danger/info   status badges (use /10 opacity for soft backgrounds)
//
// Hex values marked "sample" come from the palette cards; the rest are derived to fit.

export const THEMES = {
  // "Desain 1 – Modern & Formal" + "Panduan Desain (Style Guide)": navy sidebar, blue actions.
  formal: {
    id: 'formal',
    name: 'Modern & Formal',
    description: 'Kesan profesional, terpercaya, dan resmi.',
    scheme: 'light',
    colors: {
      brand: '#163B65', // sample: Navy Blue (Primary)
      primary: '#2563EB', // sample: Blue (Secondary) — buttons in the style guide
      primaryFg: '#FFFFFF',
      background: '#F8FAFC', // sample
      surface: '#FFFFFF', // sample
      surfaceAlt: '#F1F5F9',
      border: '#E2E8F0',
      fg: '#1E293B',
      fgMuted: '#64748B', // sample: Gray (Secondary Text)
      sidebar: '#163B65', // sample
      sidebarFg: '#FFFFFF',
      sidebarMuted: '#B6C4D6',
      success: '#16A34A', // sample
      warning: '#D97706', // sample
      danger: '#EF4444', // sample
      info: '#2563EB', // sample
    },
  },

  // "Design 1 – Light & Clean (Modern Minimalist)": white sidebar, blue actions.
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

  // "Desain 2 – Minimalis & Fresh" / "Design 3 – Fresh & Friendly": green actions, mint background.
  fresh: {
    id: 'fresh',
    name: 'Minimalis & Fresh',
    description: 'Ramah, bersih, dan mudah digunakan.',
    scheme: 'light',
    colors: {
      brand: '#059669',
      primary: '#10B981', // sample: Hijau
      primaryFg: '#FFFFFF',
      background: '#F1F7F5', // sample
      surface: '#FFFFFF', // sample
      surfaceAlt: '#F6FAF8',
      border: '#E2ECE7',
      fg: '#1F2937',
      fgMuted: '#6B7280', // sample: Gray
      sidebar: '#FFFFFF',
      sidebarFg: '#374151',
      sidebarMuted: '#6B7280',
      success: '#10B981', // sample
      warning: '#F59E0B', // sample: Amber
      danger: '#EF4444',
      info: '#2563EB', // sample: Biru
    },
  },

  // "Desain 3 – Modern Dark Mode" / "Design 2 – Dark Theme": navy/slate surfaces, blue actions.
  dark: {
    id: 'dark',
    name: 'Modern Dark Mode',
    description: 'Modern, fokus, dan nyaman untuk penggunaan lama.',
    scheme: 'dark',
    colors: {
      brand: '#3B82F6',
      primary: '#3B82F6', // sample: Blue
      primaryFg: '#FFFFFF',
      background: '#0F172A', // sample: Dark Navy
      surface: '#1E293B', // sample: Dark Slate
      surfaceAlt: '#273549',
      border: '#334155',
      fg: '#F1F5F9',
      fgMuted: '#94A3B8',
      sidebar: '#0B1222',
      sidebarFg: '#E2E8F0',
      sidebarMuted: '#94A3B8',
      success: '#10B981', // sample
      warning: '#F59E0B', // sample
      danger: '#EF4444', // sample
      info: '#3B82F6',
    },
  },
}

export const THEME_LIST = Object.values(THEMES)

export const DEFAULT_THEME_ID = 'formal'

export const THEME_STORAGE_KEY = 'spk-bansos:theme'

// camelCase token → CSS variable name, e.g. primaryFg → --theme-primary-fg
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

// localStorage can throw (private mode, blocked storage); the theme is only a preference.
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
  } catch {
    // ignore
  }
}
