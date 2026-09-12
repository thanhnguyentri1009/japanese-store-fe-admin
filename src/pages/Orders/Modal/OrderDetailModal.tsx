import { useEffect } from 'react'
import { Descriptions, Form, Modal, Select, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { Order, OrderStatus, OrderItemSummary, UpdateOrderRequest } from '../../../types/order'
import { formatMoney } from '../../../utils/formatMoney'
import { updateOrder } from '../../../services/order/OrderService'
import { getAddresses } from '../../../services/address/AddressService'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'gold' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  shipping: { label: 'Shipping', color: 'cyan' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
}

const statusOptions = (Object.keys(statusConfig) as OrderStatus[]).map((k) => ({
  value: k,
  label: statusConfig[k].label,
}))

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
    render: (v: number) => formatMoney(v),
  },
  {
    title: 'Subtotal',
    width: 130,
    render: (_, record) => formatMoney(record.quantity * record.unitPrice),
  },
]

interface Props {
  open: boolean
  order: Order | null
  onClose: () => void
}

export default function OrderDetailModal({ open, order, onClose }: Props) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses(),
  })

  useEffect(() => {
    if (order) {
      form.setFieldsValue({
        status: order.status,
        addressId: order.addressId,
        totalAmount: order.totalAmount,
      })
    }
  }, [order, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (values: UpdateOrderRequest) => updateOrder(order!.id, values),
    onSuccess: () => {
      toast.success('Order updated')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      toast.error('Failed to update order')
    },
  })

  if (!order) return null

  const statusCfg = statusConfig[order.status] ?? { label: order.status, color: 'default' }

  return (
    <Modal
      title={`Order #${order.id.slice(0, 8).toUpperCase()}`}
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isPending}
      width={680}
    >
      <Descriptions column={2} bordered size="small" style={{ marginBottom: 24, marginTop: 16 }}>
        <Descriptions.Item label="Current Status">
          <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
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
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
        <Form.Item name="status" label="Status">
          <Select placeholder="Select status" options={statusOptions} />
        </Form.Item>
        <Form.Item name="addressId" label="Address">
          <Select
            showSearch
            allowClear
            placeholder="Select address"
            filterOption={(input, opt) =>
              String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={addressesData?.data.map((a) => ({ value: a.id, label: `${a.address}, ${a.country}` })) ?? []}
          />
        </Form.Item>
        <CustomInput name="totalAmount" label="Total Amount" type="number" min={0} placeholder="0" />
      </Form>
    </Modal>
  )
}
