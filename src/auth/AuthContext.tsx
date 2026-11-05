import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Role } from '../data/types'

export interface Session {
  operatorId: string
  name: string
  role: Role
}

interface AuthValue {
  session: Session | null
  login: (operatorId: string, password: string) => Promise<Session>
  logout: () => void
}

const STORAGE_KEY = 'kalasag.session'

const AuthContext = createContext<AuthValue | null>(null)

function readStoredSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readStoredSession)

  // Mock sign-in until the Express API exists: any credentials work, and IDs
  // starting with "OP-" get the operator role (no Operators / System Log pages).
  const login = useCallback(async (operatorId: string, password: string) => {
    if (!operatorId.trim() || !password) {
      throw new Error('Enter your operator ID and password.')
    }
    const id = operatorId.trim().toUpperCase()
    const next: Session = {
      operatorId: id,
      name: 'Josh',
      role: id.startsWith('OP-') ? 'operator' : 'admin',
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSession(next)
    return next
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }, [])

  const value = useMemo(() => ({ session, login, logout }), [session, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
