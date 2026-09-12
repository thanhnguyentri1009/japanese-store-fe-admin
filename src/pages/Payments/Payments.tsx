import { useState } from 'react'
import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { TableProps } from 'antd'
import type { Payment, PaymentMethod, PaymentStatus } from '../../types/payment'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import { formatMoney } from '../../utils/formatMoney'
import { deletePayment } from '../../services/payment/PaymentService'
import AddPayment from './Modal/AddPayment'
import PaymentDetailModal from './Modal/PaymentDetailModal'
import SearchPayments from './components/SearchPayments'

const methodLabel: Record<PaymentMethod, string> = {
  cod: 'COD',
  bank_transfer: 'Bank Transfer',
  momo: 'MoMo',
  vnPay: 'VNPay',
}

const statusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'gold' },
  paid: { label: 'Paid', color: 'green' },
  failed: { label: 'Failed', color: 'red' },
}

export default function Payments() {
  const [open, setOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [params, setParams] = useState({})
  const queryClient = useQueryClient()

  const { tableData, isLoading, pagination } = useTableFetchList<Payment>({
    queryKey: ['payments'],
    url: apiUrls.payments.list,
    params,
  })

  const { mutate: removePayment } = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      toast.success('Payment deleted')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
    onError: () => {
      toast.error('Failed to delete payment')
    },
  })

  const columns: TableProps<Payment>['columns'] = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      render: (v?: string) => (v ? v.slice(0, 8).toUpperCase() : '-'),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      render: (v?: PaymentMethod) => (v ? <Tag>{methodLabel[v]}</Tag> : '-'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (v?: PaymentStatus) => {
        if (!v) return '-'
        const cfg = statusConfig[v]
        return <Tag color={cfg.color}>{cfg.label}</Tag>
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (v?: number) => (v != null ? formatMoney(v) : '-'),
    },
    {
      title: 'Paid At',
      dataIndex: 'paidAt',
      render: (v?: string) => (v ? new Date(v).toLocaleDateString('vi-VN') : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => setSelectedPayment(record)} />
          <Popconfirm
            title="Delete this payment?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => removePayment(record.id)}
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
        <Typography.Title level={4} style={{ margin: 0 }}>Payments</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Payment
        </Button>
      </div>

      <SearchPayments onSearch={(search) => setParams({ search })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddPayment open={open} onClose={() => setOpen(false)} />
      <PaymentDetailModal
        open={!!selectedPayment}
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </>
  )
}
