import { type FC, type ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { NOT_FOUND, titles } from './commons/constants'
import { routers } from './commons/constants/routers'
import AdminLayout from './layouts/AdminLayout'
import LoginLayout from './layouts/LoginLayout'

import { localStorageService, LOCAL_STORAGE_KEYS } from './utils/localStorage'
import { isAdminRole } from './utils/auth'
import { useIsAuthenticated } from './hooks/useAuth'
import { clearAccessToken } from './services/axios'
import type { JwtPayload } from './types/login'

const publicRoutes = [
  routers.LOGIN,
  routers.FORGOT_PASSWORD,
  routers.RESET_PASSWORD,
  routers.ACTIVATE,
]

const fullScreenRoutes = [routers.OTHER.NO_PERMISSION_AT_ALL]

const getStoredUser = (): JwtPayload | null => {
  const raw = localStorageService.getItem(LOCAL_STORAGE_KEYS.user)
  if (!raw) return null
  try {
    return JSON.parse(raw) as JwtPayload
  } catch {
    return null
  }
}

const AppContainer: FC<{ children: ReactNode }> = ({ children }) => {
  const { pathname } = useLocation()
  const isAuthenticated = useIsAuthenticated()
  const isPublicRoute = publicRoutes.includes(pathname)

  // Re-derived on every render (i.e. on every navigation, since useLocation() re-renders on
  // pathname change) instead of only once on mount — a stale token/role can't slip through by
  // navigating client-side after the initial check.
  const storedUser = isAuthenticated ? getStoredUser() : null
  const hasAdminAccess = isAuthenticated && !!storedUser && isAdminRole(storedUser.role)
  const isStaleSession = isAuthenticated && !hasAdminAccess

  useEffect(() => {
    if (isStaleSession) {
      clearAccessToken()
      localStorageService.removeItem(LOCAL_STORAGE_KEYS.user)
    }
  }, [isStaleSession])

  useEffect(() => {
    document.title =
      Object.entries(titles).find(([key]) => pathname.includes(key))?.[1] || NOT_FOUND
  }, [pathname])

  if (isStaleSession) {
    return <Navigate to={routers.LOGIN} replace />
  }

  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to={routers.LOGIN} replace />
  }

  if (hasAdminAccess && isPublicRoute) {
    return <Navigate to={routers.DASHBOARD} replace />
  }

  if (isPublicRoute) {
    return <LoginLayout>{children}</LoginLayout>
  }

  if (fullScreenRoutes.includes(pathname)) {
    return <>{children}</>
  }

  return <AdminLayout>{children}</AdminLayout>
}

export default AppContainer
