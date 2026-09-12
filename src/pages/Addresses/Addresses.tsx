import { useState } from 'react'
import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { TableProps } from 'antd'
import type { Address } from '../../types/address'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import { deleteAddress } from '../../services/address/AddressService'
import AddAddress from './Modal/AddAddress'
import AddressDetailModal from './Modal/AddressDetailModal'
import SearchAddresses from './components/SearchAddresses'

export default function Addresses() {
  const [open, setOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [params, setParams] = useState({})
  const queryClient = useQueryClient()

  const { tableData, isLoading, pagination } = useTableFetchList<Address>({
    queryKey: ['addresses'],
    url: apiUrls.addresses.list,
    params,
  })

  const { mutate: removeAddress } = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      toast.success('Address deleted')
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
    onError: () => {
      toast.error('Failed to delete address')
    },
  })

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
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => setSelectedAddress(record)} />
          <Popconfirm
            title="Delete this address?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => removeAddress(record.id)}
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
      <AddressDetailModal
        open={!!selectedAddress}
        address={selectedAddress}
        onClose={() => setSelectedAddress(null)}
      />
    </>
  )
}
