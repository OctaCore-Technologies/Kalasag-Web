import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import type { Role } from '../data/types'
import { useAuth } from './AuthContext'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  const location = useLocation()
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

export function RequireRole({ role }: { role: Role }) {
  const { session } = useAuth()
  if (session?.role !== role) return <Navigate to="/map" replace />
  return <Outlet />
}
