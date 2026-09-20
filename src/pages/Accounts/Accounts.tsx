import { useState } from 'react'
import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { TableProps } from 'antd'
import type { Account } from '../../types/account'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import { deleteAccount } from '../../services/account/AccountService'
import AddAccount from './Modal/AddAccount'
import AccountDetailModal from './Modal/AccountDetailModal'
import SearchAccounts from './components/SearchAccounts'

export default function Accounts() {
  const [open, setOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [params, setParams] = useState({})
  const queryClient = useQueryClient()

  const { tableData, isLoading, pagination } = useTableFetchList<Account>({
    queryKey: ['accounts'],
    url: apiUrls.accounts.list,
    params,
  })

  const { mutate: removeAccount } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted')
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: () => {
      toast.error('Failed to delete account')
    },
  })

  const columns: TableProps<Account>['columns'] = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role: Account['role']) => (role ? <Tag color="purple">{role.name}</Tag> : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => setSelectedAccount(record)} />
          <Popconfirm
            title="Delete this account?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => removeAccount(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Accounts</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Account
        </Button>
      </div>

      <SearchAccounts onSearch={(searchText) => setParams({ searchText })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddAccount open={open} onClose={() => setOpen(false)} />
      <AccountDetailModal
        open={!!selectedAccount}
        account={selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </>
  )
}
