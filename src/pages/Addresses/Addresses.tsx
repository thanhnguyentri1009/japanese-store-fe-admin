import { useState } from 'react'
import { Button, Table, Tag, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { Address } from '../../types/address'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import AddAddress from './Modal/AddAddress'
import SearchAddresses from './components/SearchAddresses'

const columns: TableProps<Address>['columns'] = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Address', dataIndex: 'address' },
  { title: 'City', dataIndex: 'city', render: (v) => v ?? '-' },
  { title: 'Country', dataIndex: 'country' },
  {
    title: 'Default',
    dataIndex: 'isDefault',
    render: (v: boolean) => (v ? <Tag color="blue">Default</Tag> : '-'),
  },
]

export default function Addresses() {
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Address>({
    queryKey: ['addresses'],
    url: apiUrls.addresses.list,
    params,
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Addresses</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Address
        </Button>
      </div>

      <SearchAddresses onSearch={(search) => setParams({ search })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddAddress open={open} onClose={() => setOpen(false)} />
    </>
  )
}
