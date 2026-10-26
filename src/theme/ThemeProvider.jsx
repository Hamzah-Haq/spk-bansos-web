import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { THEMES, THEME_LIST, applyTheme, loadThemeId, saveThemeId } from './themes.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(loadThemeId)

  // Layout effect: colors are applied before the first paint, so no flash of the default theme.
  useLayoutEffect(() => applyTheme(themeId), [themeId])

  const setThemeId = useCallback((id) => {
    if (!(id in THEMES)) return
    saveThemeId(id)
    setThemeIdState(id)
  }, [])

  const value = useMemo(
    () => ({ theme: THEMES[themeId], themes: THEME_LIST, setThemeId }),
    [themeId, setThemeId],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

// eslint-disable-next-line react/only-export-components -- hook belongs with its provider
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
