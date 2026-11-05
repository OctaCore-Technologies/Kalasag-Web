import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { FirebaseError } from 'firebase/app'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { doc, getDoc, getDocFromCache, type DocumentData } from 'firebase/firestore'
import type { Role } from '../data/types'
import { auth, db } from '../lib/firebase'
import { operatorEmail } from '../lib/operatorEmail'

export interface Session {
  uid: string
  operatorId: string
  name: string
  role: Role
}

interface AuthValue {
  /** False until Firebase has restored (or ruled out) a saved session. */
  ready: boolean
  session: Session | null
  login: (operatorId: string, password: string) => Promise<Session>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

/**
 * Role and display name live in users/{uid}. Read the local cache first so an
 * offline reload doesn't wait on the network; fetch from the server only on a miss.
 */
async function loadSession(user: User): Promise<Session> {
  const fallbackId = user.email?.split('@')[0].toUpperCase() ?? 'OPERATOR'
  const ref = doc(db, 'users', user.uid)
  let data: DocumentData | undefined
  try {
    data = (await getDocFromCache(ref)).data()
  } catch {
    // Not cached yet (first sign-in on this device).
  }
  if (!data) {
    try {
      data = (await getDoc(ref)).data()
    } catch {
      // Offline with nothing cached: fall back to the least-privileged role.
    }
  }
  return {
    uid: user.uid,
    operatorId: data?.operatorId ?? fallbackId,
    name: data?.name ?? fallbackId,
    role: data?.role === 'admin' ? 'admin' : 'operator',
  }
}

function loginErrorMessage(error: unknown) {
  const code = error instanceof FirebaseError ? error.code : ''
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-email':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect Operator ID or password.'
    case 'auth/network-request-failed':
      return "Can't reach the server. Sign in once while online — after that the console keeps working offline."
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again in a few minutes.'
    case 'auth/user-disabled':
      return 'This operator account has been disabled.'
    default:
      return 'Unable to sign in. Please try again.'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        setSession(user ? await loadSession(user) : null)
        setReady(true)
      }),
    [],
  )

  const login = useCallback(async (operatorId: string, password: string) => {
    if (!operatorId.trim() || !password) {
      throw new Error('Enter your operator ID and password.')
    }
    try {
      const { user } = await signInWithEmailAndPassword(auth, operatorEmail(operatorId), password)
      const next = await loadSession(user)
      setSession(next)
      return next
    } catch (error) {
      throw new Error(loginErrorMessage(error))
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setSession(null)
  }, [])

  const value = useMemo(() => ({ ready, session, login, logout }), [ready, session, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
