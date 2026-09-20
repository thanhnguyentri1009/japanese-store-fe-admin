import { useState } from 'react'
import { Button, Popconfirm, Space, Table, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { TableProps } from 'antd'
import type { Brand } from '../../types/brand'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import { deleteBrand } from '../../services/brand/BrandService'
import AddBrand from './Modal/AddBrand'
import BrandDetailModal from './Modal/BrandDetailModal'
import SearchBrands from './components/SearchBrands'

export default function Brands() {
  const [open, setOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [params, setParams] = useState({})
  const queryClient = useQueryClient()

  const { tableData, isLoading, pagination } = useTableFetchList<Brand>({
    queryKey: ['brands'],
    url: apiUrls.brands.list,
    params,
  })

  const { mutate: removeBrand } = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      toast.success('Brand deleted')
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
    onError: () => {
      toast.error('Failed to delete brand')
    },
  })

  const columns: TableProps<Brand>['columns'] = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => setSelectedBrand(record)} />
          <Popconfirm
            title="Delete this brand?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => removeBrand(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Brands
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Brand
        </Button>
      </div>

      <SearchBrands onSearch={(searchText) => setParams({ searchText })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddBrand open={open} onClose={() => setOpen(false)} />
      <BrandDetailModal
        open={!!selectedBrand}
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
      />
    </>
  )
}
