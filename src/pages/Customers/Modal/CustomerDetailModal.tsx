import { useEffect } from 'react'
import { Descriptions, Form } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import { updateCustomer } from '../../../services/customer/CustomerService'
import type { Customer, UpdateCustomerRequest } from '../../../types/customer'

interface CustomerDetailModalProps {
  open: boolean
  customer: Customer | null
  onClose: () => void
}

export default function CustomerDetailModal({ open, customer, onClose }: CustomerDetailModalProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (customer) form.setFieldsValue(customer)
  }, [customer, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (values: UpdateCustomerRequest) => updateCustomer(customer!.id, values),
    onSuccess: () => {
      toast.success('Customer updated')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: () => {
      toast.error('Failed to update customer')
    },
  })

  if (!customer) return null

  return (
    <CustomModal
      title="Customer Detail"
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isPending}
    >
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="ID">{customer.id}</Descriptions.Item>
        <Descriptions.Item label="Joined">
          {new Date(customer.createdAt).toLocaleString('vi-VN')}
        </Descriptions.Item>
      </Descriptions>

      <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
        <CustomInput
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
          placeholder="Customer name"
        />
        <CustomInput
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Invalid email' },
          ]}
          placeholder="email@example.com"
        />
        <CustomInput name="phone" label="Phone" placeholder="0901234567" />
      </Form>
    </CustomModal>
  )
}
