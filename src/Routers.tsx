import { Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import { routers } from './commons/constants/routers'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Users from './pages/Users'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

interface AppRoute {
  key: string
  path: string
  element: ReactElement
}

const routes: AppRoute[] = [
  { key: 'dashboard', path: routers.DASHBOARD, element: <Dashboard /> },
  { key: 'products', path: routers.PRODUCTS, element: <Products /> },
  { key: 'orders', path: routers.ORDERS, element: <Orders /> },
  { key: 'users', path: routers.USERS, element: <Users /> },
]

export default function Routers() {
  return (
    <>
      <Routes>
        {/* Unauthorize routes */}
        <Route path={routers.LOGIN} element={<Login />} />
        <Route path="*" element={<NotFound />} />

        {/* Authorize routes */}
        {routes.map(({ key, path, element }) => (
          <Route key={key} path={path} element={element} />
        ))}
      </Routes>
    </>
  )
}
