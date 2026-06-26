import { Table, Typography, Tag } from 'antd'
import type { TableProps } from 'antd'

interface Order {
  id: string
  customer: string
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  date: string
}

const statusMap = {
  pending: { label: 'Pending', color: 'gold' },
  processing: { label: 'Processing', color: 'blue' },
  completed: { label: 'Completed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
}

const mockData: Order[] = [
  { id: '#ORD-001', customer: 'John Doe', total: 120000, status: 'completed', date: '2026-06-20' },
  { id: '#ORD-002', customer: 'Jane Smith', total: 85000, status: 'processing', date: '2026-06-22' },
  { id: '#ORD-003', customer: 'Bob Johnson', total: 250000, status: 'pending', date: '2026-06-24' },
]

const columns: TableProps<Order>['columns'] = [
  { title: 'Order ID', dataIndex: 'id' },
  { title: 'Customer', dataIndex: 'customer' },
  { title: 'Total', dataIndex: 'total', render: (v) => `₫${v.toLocaleString('en-US')}` },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (v: Order['status']) => <Tag color={statusMap[v].color}>{statusMap[v].label}</Tag>,
  },
  { title: 'Date', dataIndex: 'date' },
]

export default function Orders() {
  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>Orders</Typography.Title>
      <Table columns={columns} dataSource={mockData} rowKey="id" />
    </>
  )
}
