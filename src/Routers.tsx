import { Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import { routers } from './commons/constants/routers'
import Dashboard from './pages/Dashboard/Dashboard'
import Accounts from './pages/Accounts/Accounts'
import Roles from './pages/Roles/Roles'
import Categories from './pages/Categories/Categories'
import Brands from './pages/Brands/Brands'
import Products from './pages/Products/Products'
import Customers from './pages/Customers/Customers'
import Addresses from './pages/Addresses/Addresses'
import Orders from './pages/Orders/Orders'
import Payments from './pages/Payments/Payments'
import Login from './pages/Login/Login'
import NotFound from './pages/NotFound/NotFound'

interface AppRoute {
  key: string
  path: string
  element: ReactElement
}

const routes: AppRoute[] = [
  { key: 'dashboard', path: routers.DASHBOARD, element: <Dashboard /> },
  { key: 'accounts', path: routers.ACCOUNTS, element: <Accounts /> },
  { key: 'roles', path: routers.ROLES, element: <Roles /> },
  { key: 'categories', path: routers.CATEGORIES, element: <Categories /> },
  { key: 'brands', path: routers.BRANDS, element: <Brands /> },
  { key: 'products', path: routers.PRODUCTS, element: <Products /> },
  { key: 'customers', path: routers.CUSTOMERS, element: <Customers /> },
  { key: 'addresses', path: routers.ADDRESSES, element: <Addresses /> },
  { key: 'orders', path: routers.ORDERS, element: <Orders /> },
  { key: 'payments', path: routers.PAYMENTS, element: <Payments /> },
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
