import { type FC, type ReactNode, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NOT_FOUND, titles, TOKEN_KEY } from './commons/constants'
import { navigators, routers } from './commons/constants/routers'
import AdminLayout from './layouts/AdminLayout'
import LoginLayout from './layouts/LoginLayout'

import { localStorageService, LOCAL_STORAGE_KEYS } from './utils/localStorage'
import { isEmpty } from 'lodash'

const publicRoutes = [
  routers.LOGIN,
  routers.FORGOT_PASSWORD,
  routers.RESET_PASSWORD,
  routers.ACTIVATE,
]

const fullScreenRoutes = [routers.OTHER.NO_PERMISSION_AT_ALL]

const AppContainer: FC<{ children: ReactNode }> = ({ children }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorageService.getItem(LOCAL_STORAGE_KEYS.user)
    const token = localStorageService.getItem(TOKEN_KEY)

    if (isEmpty(token) && !publicRoutes.includes(pathname)) {
      navigate(navigators.LOGIN)
    }

    if (!isEmpty(user) && publicRoutes.includes(pathname)) {
      navigate(navigators.DASHBOARD)
    }
  }, [])

  useEffect(() => {
    document.title =
      Object.entries(titles).find(([key]) => pathname.includes(key))?.[1] || NOT_FOUND
  }, [pathname])

  if (publicRoutes.includes(pathname)) {
    return <LoginLayout>{children}</LoginLayout>
  }

  if (fullScreenRoutes.includes(pathname)) {
    return <>{children}</>
  }

  return <AdminLayout>{children}</AdminLayout>
}

export default AppContainer
