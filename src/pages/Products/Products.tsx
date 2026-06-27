import { useState } from 'react'
import { Button, Image, Table, Tag, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { Product } from '../../types/product'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import AddProduct from './Modal/AddProduct'
import SearchProducts from './components/SearchProducts'

const columns: TableProps<Product>['columns'] = [
  { title: 'ID', dataIndex: 'id' },
  {
    title: 'Image',
    dataIndex: 'image',
    width: 72,
    render: (src) =>
      src ? (
        <Image src={src} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} />
      ) : (
        '-'
      ),
  },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Series', dataIndex: 'series', render: (v) => v ?? '-' },
  {
    title: 'Category',
    dataIndex: 'category',
    render: (c: Product['category']) => c?.name ?? '-',
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    render: (b: Product['brand']) => b?.name ?? '-',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    render: (v: number) => `₫${v.toLocaleString('vi-VN')}`,
  },
  {
    title: 'Stock',
    render: (_, record) => record.detail?.stock ?? '-',
  },
  {
    title: 'Status',
    render: (_, record) =>
      record.detail ? (
        <Tag color={record.detail.isActive ? 'green' : 'default'}>
          {record.detail.isActive ? 'Active' : 'Inactive'}
        </Tag>
      ) : (
        '-'
      ),
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
  },
]

export default function Products() {
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Product>({
    queryKey: ['products'],
    url: apiUrls.products.list,
    params,
  })

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
          Products
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Product
        </Button>
      </div>

      <SearchProducts onSearch={(search) => setParams({ search })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddProduct open={open} onClose={() => setOpen(false)} />
    </>
  )
}
