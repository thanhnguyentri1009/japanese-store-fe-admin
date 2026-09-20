import { useState } from 'react'
import { Button, Image, InputNumber, Popconfirm, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { TableProps } from 'antd'
import type { Product } from '../../types/product'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import { formatMoney } from '../../utils/formatMoney'
import { deleteProduct } from '../../services/product/ProductService'
import AddProduct from './Modal/AddProduct'
import ProductDetailModal from './Modal/ProductDetailModal'
import SearchProducts from './components/SearchProducts'

const baseColumns: TableProps<Product>['columns'] = [
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
    render: (v: number) => formatMoney(v),
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [params, setParams] = useState<{ searchText?: string; size?: number }>({})
  const queryClient = useQueryClient()

  const { tableData, isLoading, pagination } = useTableFetchList<Product>({
    queryKey: ['products'],
    url: apiUrls.products.list,
    params,
  })

  const { mutate: removeProduct } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Product deleted')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error('Failed to delete product')
    },
  })

  const columns: TableProps<Product>['columns'] = [
    ...baseColumns!,
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => setSelectedProduct(record)} />
          <Popconfirm
            title="Delete this product?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => removeProduct(record.id)}
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
          Products
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Product
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <SearchProducts
          onSearch={(searchText) => setParams((prev) => ({ ...prev, searchText: searchText || undefined }))}
        />
        <InputNumber
          placeholder="Filter by size"
          min={0}
          style={{ width: 160 }}
          onChange={(size) => setParams((prev) => ({ ...prev, size: size ?? undefined }))}
        />
      </Space>
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddProduct open={open} onClose={() => setOpen(false)} />
      <ProductDetailModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}
