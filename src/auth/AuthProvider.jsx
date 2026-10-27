import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AUTH_EXPIRED_EVENT, api } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null })

  useEffect(() => {
    let cancelled = false
    api('/auth/me')
      .then(({ user }) => !cancelled && setState({ status: 'authenticated', user }))
      .catch(() => !cancelled && setState({ status: 'guest', user: null }))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const expire = () => setState({ status: 'guest', user: null })
    window.addEventListener(AUTH_EXPIRED_EVENT, expire)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, expire)
  }, [])

  const login = useCallback(async (username, password) => {
    const { user } = await api('/auth/login', { method: 'POST', body: { username, password } })
    setState({ status: 'authenticated', user })
    return user
  }, [])

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' })
    } finally {
      setState({ status: 'guest', user: null })
    }
  }, [])

  // Re-reads /auth/me after the user's own account was edited
  const refreshUser = useCallback(async () => {
    const { user } = await api('/auth/me')
    setState({ status: 'authenticated', user })
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      refreshUser,
    }),
    [state, login, logout, refreshUser],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

// eslint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
