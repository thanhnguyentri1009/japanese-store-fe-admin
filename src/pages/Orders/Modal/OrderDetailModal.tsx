import { Modal, Table, Tag, Descriptions } from 'antd'
import type { TableProps } from 'antd'
import type { Order, OrderStatus, OrderItemSummary } from '../../../types/order'

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'gold' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  shipping: { label: 'Shipping', color: 'cyan' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
}

const itemColumns: TableProps<OrderItemSummary>['columns'] = [
  {
    title: 'Product',
    render: (_, record) => record.product?.name ?? record.productId ?? '-',
  },
  { title: 'Quantity', dataIndex: 'quantity', width: 90 },
  {
    title: 'Unit Price',
    dataIndex: 'unitPrice',
    width: 130,
    render: (v: number) => `₫${v.toLocaleString('vi-VN')}`,
  },
  {
    title: 'Subtotal',
    width: 130,
    render: (_, record) => `₫${(record.quantity * record.unitPrice).toLocaleString('vi-VN')}`,
  },
]

interface Props {
  open: boolean
  order: Order | null
  onClose: () => void
}

export default function OrderDetailModal({ open, order, onClose }: Props) {
  if (!order) return null

  const statusCfg = statusConfig[order.status] ?? { label: order.status, color: 'default' }

  return (
    <Modal
      title={`Order #${order.id.slice(0, 8).toUpperCase()}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
    >
      <Descriptions column={2} bordered size="small" style={{ marginBottom: 24, marginTop: 16 }}>
        <Descriptions.Item label="Status">
          <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Total">
          {order.totalAmount != null ? `₫${order.totalAmount.toLocaleString('vi-VN')}` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {new Date(order.orderedAt).toLocaleString('vi-VN')}
        </Descriptions.Item>
        <Descriptions.Item label="Payment">
          {order.payment ? (
            <Tag
              color={
                order.payment.status === 'paid'
                  ? 'green'
                  : order.payment.status === 'failed'
                    ? 'red'
                    : 'gold'
              }
            >
              {order.payment.status ?? '-'}
            </Tag>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        {order.address && (
          <Descriptions.Item label="Address" span={2}>
            {order.address.address}, {order.address.city ? `${order.address.city}, ` : ''}
            {order.address.country}
          </Descriptions.Item>
        )}
      </Descriptions>

      <Table
        columns={itemColumns}
        dataSource={order.items}
        rowKey="id"
        pagination={false}
        size="small"
        title={() => <strong>Items ({order.items.length})</strong>}
      />
    </Modal>
  )
}
