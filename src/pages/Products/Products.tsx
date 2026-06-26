import { Button, Table, Typography, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive'
}

const mockData: Product[] = [
  { id: 1, name: 'Strawberry Mochi', category: 'Sweets', price: 35000, stock: 120, status: 'active' },
  { id: 2, name: 'Matcha Green Tea', category: 'Beverages', price: 85000, stock: 45, status: 'active' },
  { id: 3, name: 'Salmon Onigiri', category: 'Rice Balls', price: 25000, stock: 0, status: 'inactive' },
]

const columns: TableProps<Product>['columns'] = [
  { title: 'ID', dataIndex: 'id', width: 60 },
  { title: 'Product Name', dataIndex: 'name' },
  { title: 'Category', dataIndex: 'category' },
  { title: 'Price', dataIndex: 'price', render: (v) => `₫${v.toLocaleString('en-US')}` },
  { title: 'Stock', dataIndex: 'stock' },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (v) => <Tag color={v === 'active' ? 'green' : 'default'}>{v === 'active' ? 'Active' : 'Inactive'}</Tag>,
  },
]

export default function Products() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Products</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
      </div>
      <Table columns={columns} dataSource={mockData} rowKey="id" />
    </>
  )
}
