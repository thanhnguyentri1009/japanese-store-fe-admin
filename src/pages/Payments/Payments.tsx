import { useState } from 'react'
import { Button, Table, Tag, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { Payment, PaymentMethod, PaymentStatus } from '../../types/payment'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import AddPayment from './Modal/AddPayment'
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
    render: (v?: number) => (v != null ? `₫${v.toLocaleString('vi-VN')}` : '-'),
  },
  {
    title: 'Paid At',
    dataIndex: 'paidAt',
    render: (v?: string) => (v ? new Date(v).toLocaleDateString('vi-VN') : '-'),
  },
]

export default function Payments() {
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Payment>({
    queryKey: ['payments'],
    url: apiUrls.payments.list,
    params,
  })

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
    </>
  )
}
