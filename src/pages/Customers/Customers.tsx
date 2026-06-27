import { useState } from 'react'
import { Button, Table, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { Customer } from '../../types/customer'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import AddCustomer from './Modal/AddCustomer'
import SearchCustomers from './components/SearchCustomers'

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
]

export default function Customers() {
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Customer>({
    queryKey: ['customers'],
    url: apiUrls.customers.list,
    params,
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Customers</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Customer
        </Button>
      </div>

      <SearchCustomers onSearch={(search) => setParams({ search })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddCustomer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
