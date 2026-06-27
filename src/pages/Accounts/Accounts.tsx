import { useState } from 'react'
import { Button, Table, Tag, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { Account } from '../../types/account'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import AddAccount from './Modal/AddAccount'
import SearchAccounts from './components/SearchAccounts'

const columns: TableProps<Account>['columns'] = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Username', dataIndex: 'username' },
  { title: 'Email', dataIndex: 'email' },
  {
    title: 'Role',
    dataIndex: 'role',
    render: (role: Account['role']) => (role ? <Tag color="purple">{role.name}</Tag> : '-'),
  },
]

export default function Accounts() {
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Account>({
    queryKey: ['accounts'],
    url: apiUrls.accounts.list,
    params,
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Accounts</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Account
        </Button>
      </div>

      <SearchAccounts onSearch={(search) => setParams({ search })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddAccount open={open} onClose={() => setOpen(false)} />
    </>
  )
}
