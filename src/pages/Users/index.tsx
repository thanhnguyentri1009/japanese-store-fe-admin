import { Table, Typography, Avatar, Tag } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'customer'
  joined: string
}

const mockData: User[] = [
  { id: 1, name: 'Tri Thanh', email: 'thanh@tribox.me', role: 'admin', joined: '2025-01-01' },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'customer', joined: '2026-03-15' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', joined: '2026-05-10' },
]

const columns: TableProps<User>['columns'] = [
  {
    title: 'User',
    dataIndex: 'name',
    render: (name) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Avatar icon={<UserOutlined />} size="small" />
        {name}
      </span>
    ),
  },
  { title: 'Email', dataIndex: 'email' },
  {
    title: 'Role',
    dataIndex: 'role',
    render: (v) => <Tag color={v === 'admin' ? 'purple' : 'default'}>{v === 'admin' ? 'Admin' : 'Customer'}</Tag>,
  },
  { title: 'Joined', dataIndex: 'joined' },
]

export default function Users() {
  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>Users</Typography.Title>
      <Table columns={columns} dataSource={mockData} rowKey="id" />
    </>
  )
}
