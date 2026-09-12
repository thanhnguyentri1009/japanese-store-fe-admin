import { useEffect } from 'react'
import { DatePicker, Descriptions, Form, Select } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import { updatePayment } from '../../../services/payment/PaymentService'
import type { Payment, PaymentMethod, PaymentStatus, UpdatePaymentRequest } from '../../../types/payment'

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

interface PaymentDetailModalProps {
  open: boolean
  payment: Payment | null
  onClose: () => void
}

export default function PaymentDetailModal({ open, payment, onClose }: PaymentDetailModalProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (payment) {
      form.setFieldsValue({
        method: payment.method,
        status: payment.status,
        amount: payment.amount,
        paidAt: payment.paidAt ? dayjs(payment.paidAt) : undefined,
      })
    }
  }, [payment, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (values: UpdatePaymentRequest) => updatePayment(payment!.id, values),
    onSuccess: () => {
      toast.success('Payment updated')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
    onError: () => {
      toast.error('Failed to update payment')
    },
  })

  if (!payment) return null

  return (
    <CustomModal
      title="Payment Detail"
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isPending}
    >
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="ID">{payment.id}</Descriptions.Item>
        <Descriptions.Item label="Order ID">
          {payment.orderId ? payment.orderId.slice(0, 8).toUpperCase() : '-'}
        </Descriptions.Item>
      </Descriptions>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => mutate({ ...values, paidAt: values.paidAt?.toISOString() })}
      >
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
