import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, theme, Typography, Avatar, Dropdown, Space } from 'antd'
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  TagsOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  UnorderedListOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import { logout } from '../services/login/LoginService'
import { clearAccessToken } from '../services/axios'
import { localStorageService, LOCAL_STORAGE_KEYS } from '../utils/localStorage'
import { routers } from '../commons/constants/routers'

const { Header, Sider, Content } = Layout

const menuItems: MenuProps['items'] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  {
    key: 'catalog',
    icon: <AppstoreOutlined />,
    label: 'Catalog',
    children: [
      { key: '/products', icon: <ShopOutlined />, label: 'Products' },
      { key: '/categories', icon: <TagsOutlined />, label: 'Categories' },
      { key: '/brands', icon: <SafetyOutlined />, label: 'Brands' },
    ],
  },
  {
    key: 'sales',
    icon: <ShoppingCartOutlined />,
    label: 'Sales',
    children: [
      { key: '/orders', icon: <UnorderedListOutlined />, label: 'Orders' },
      { key: '/payments', icon: <CreditCardOutlined />, label: 'Payments' },
    ],
  },
  { key: '/customers', icon: <TeamOutlined />, label: 'Customers' },
  { key: '/addresses', icon: <EnvironmentOutlined />, label: 'Addresses' },
  {
    key: 'system',
    icon: <UserOutlined />,
    label: 'System',
    children: [
      { key: '/accounts', icon: <UserOutlined />, label: 'Accounts' },
      { key: '/roles', icon: <SafetyOutlined />, label: 'Roles' },
    ],
  },
]

const userMenuItems: MenuProps['items'] = [
  { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
]

interface Props {
  children: ReactNode
}

export default function AdminLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  const handleUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key !== 'logout') return
    try {
      await logout()
    } catch {
      // Best-effort: even if the server call fails, still end the local session below.
    } finally {
      clearAccessToken()
      localStorageService.removeItem(LOCAL_STORAGE_KEYS.user)
      navigate(routers.LOGIN)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Typography.Title level={5} style={{ margin: 0, color: token.colorPrimary }}>
            {collapsed ? 'JP' : 'JP Store Admin'}
          </Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['catalog', 'sales', 'system']}
          items={menuItems}
          style={{ borderRight: 0, marginTop: 8, fontSize: 16 }}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{ fontSize: 18, cursor: 'pointer', color: token.colorText }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>

          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
              <Typography.Text>Admin</Typography.Text>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            minHeight: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
