import { useState } from 'react'
import { Button, Table, Tag, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { Order, OrderStatus } from '../../types/order'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import SearchOrders from './components/SearchOrders'
import AddOrder from './Modal/AddOrder'
import OrderDetailModal from './Modal/OrderDetailModal'

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'gold' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  shipping: { label: 'Shipping', color: 'cyan' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
}

const columns: TableProps<Order>['columns'] = [
  {
    title: 'Order ID',
    dataIndex: 'id',
    render: (v: string) => v.slice(0, 8).toUpperCase(),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (v: OrderStatus) => {
      const cfg = statusConfig[v] ?? { label: v, color: 'default' }
      return <Tag color={cfg.color}>{cfg.label}</Tag>
    },
  },
  {
    title: 'Total',
    dataIndex: 'totalAmount',
    render: (v?: number) => (v != null ? `₫${v.toLocaleString('vi-VN')}` : '-'),
  },
  {
    title: 'Items',
    dataIndex: 'items',
    render: (items: Order['items']) => items.length,
  },
  {
    title: 'Payment',
    render: (_, record) => {
      const p = record.payment
      if (!p) return '-'
      return (
        <Tag color={p.status === 'paid' ? 'green' : p.status === 'failed' ? 'red' : 'gold'}>
          {p.status ?? '-'}
        </Tag>
      )
    },
  },
  {
    title: 'Date',
    dataIndex: 'orderedAt',
    render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
  },
]

export default function Orders() {
  const [openAdd, setOpenAdd] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Order>({
    queryKey: ['orders'],
    url: apiUrls.orders.list,
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
          Orders
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenAdd(true)}>
          Add Order
        </Button>
      </div>

      <SearchOrders onSearch={(search) => setParams({ search })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
        onRow={(record) => ({
          onClick: () => setSelectedOrder(record),
          style: { cursor: 'pointer' },
        })}
      />

      <AddOrder open={openAdd} onClose={() => setOpenAdd(false)} />
      <OrderDetailModal
        open={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  )
}
