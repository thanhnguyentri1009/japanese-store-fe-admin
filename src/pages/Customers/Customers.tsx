import { useState } from 'react'
import { Button, Popconfirm, Space, Table, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { TableProps } from 'antd'
import type { Customer } from '../../types/customer'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import { deleteCustomer } from '../../services/customer/CustomerService'
import AddCustomer from './Modal/AddCustomer'
import CustomerDetailModal from './Modal/CustomerDetailModal'
import SearchCustomers from './components/SearchCustomers'

export default function Customers() {
  const [open, setOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [params, setParams] = useState({})
  const queryClient = useQueryClient()

  const { tableData, isLoading, pagination } = useTableFetchList<Customer>({
    queryKey: ['customers'],
    url: apiUrls.customers.list,
    params,
  })

  const { mutate: removeCustomer } = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      toast.success('Customer deleted')
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: () => {
      toast.error('Failed to delete customer')
    },
  })

  const columns: TableProps<Customer>['columns'] = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone', render: (v) => v ?? '-' },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => setSelectedCustomer(record)} />
          <Popconfirm
            title="Delete this customer?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => removeCustomer(record.id)}
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
        <Typography.Title level={4} style={{ margin: 0 }}>Customers</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Customer
        </Button>
      </div>

      <SearchCustomers onSearch={(searchText) => setParams({ searchText })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddCustomer open={open} onClose={() => setOpen(false)} />
      <CustomerDetailModal
        open={!!selectedCustomer}
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </>
  )
}
