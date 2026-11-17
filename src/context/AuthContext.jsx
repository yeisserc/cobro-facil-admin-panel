import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { setUnauthorizedHandler } from '../lib/api'
import { TOKEN_KEY, USER_KEY } from '../lib/constants'

const AuthContext = createContext(null)

function loadSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const rawUser = localStorage.getItem(USER_KEY)
    if (!token || !rawUser) return null
    return { token, user: JSON.parse(rawUser) }
  } catch {
    return null
  }
}

function persistSession(session) {
  localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
}

function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession)

  const logout = useCallback(() => {
    clearStoredSession()
    setSession(null)
  }, [])

  const login = useCallback((result) => {
    const next = { token: result.token, user: result.user }
    persistSession(next)
    setSession(next)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearStoredSession()
      setSession(null)
    })
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
