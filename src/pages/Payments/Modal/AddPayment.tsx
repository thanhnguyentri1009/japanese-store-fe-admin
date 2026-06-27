import { Form, DatePicker, Select } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal'
import CustomInput from '../../../commons/components/CustomInput'
import { createPayment } from '../../../services/payment/PaymentService'
import { getOrders } from '../../../services/order/OrderService'
import type { PaymentMethod, PaymentStatus } from '../../../types/payment'

const methodLabel: Record<PaymentMethod, string> = {
  cod: 'COD',
  bank_transfer: 'Bank Transfer',
  momo: 'MoMo',
  vnPay: 'VNPay',
}

const statusConfig: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
}

const methodOptions = (Object.keys(methodLabel) as PaymentMethod[]).map((k) => ({
  value: k,
  label: methodLabel[k],
}))

const statusOptions = (Object.keys(statusConfig) as PaymentStatus[]).map((k) => ({
  value: k,
  label: statusConfig[k],
}))

interface AddPaymentProps {
  open: boolean
  onClose: () => void
}

export default function AddPayment({ open, onClose }: AddPaymentProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders(),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toast.success('Payment created')
      form.resetFields()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
    onError: () => {
      toast.error('Failed to create payment')
    },
  })

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <CustomModal
      title="Add Payment"
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isPending}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => mutate({ ...values, paidAt: values.paidAt?.toISOString() })}
        style={{ marginTop: 16 }}
      >
        <Form.Item name="orderId" label="Order" rules={[{ required: true, message: 'Please select order' }]}>
          <Select
            showSearch
            placeholder="Select order"
            filterOption={(input, opt) =>
              String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={
              ordersData?.data.map((o) => ({
                value: o.id,
                label: `${o.id.slice(0, 8).toUpperCase()} — ${o.status}`,
              })) ?? []
            }
          />
        </Form.Item>
        <Form.Item name="method" label="Payment Method">
          <Select placeholder="Select method" allowClear options={methodOptions} />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select placeholder="Select status" allowClear options={statusOptions} />
        </Form.Item>
        <CustomInput name="amount" label="Amount" type="number" min={0} placeholder="0" />
        <Form.Item name="paidAt" label="Paid At">
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </CustomModal>
  )
}
