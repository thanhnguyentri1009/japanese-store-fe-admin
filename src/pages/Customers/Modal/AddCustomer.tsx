import { Form } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal'
import CustomInput from '../../../commons/components/CustomInput'
import { createCustomer } from '../../../services/customer/CustomerService'

interface AddCustomerProps {
  open: boolean
  onClose: () => void
}

export default function AddCustomer({ open, onClose }: AddCustomerProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast.success('Customer created')
      form.resetFields()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: () => {
      toast.error('Failed to create customer')
    },
  })

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <CustomModal
      title="Add Customer"
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isPending}
    >
      <Form form={form} layout="vertical" onFinish={(values) => mutate(values)} style={{ marginTop: 16 }}>
        <CustomInput
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
          placeholder="Full name"
        />
        <CustomInput
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Invalid email' }]}
          placeholder="email@example.com"
        />
        <CustomInput name="phone" label="Phone" placeholder="0901234567" />
      </Form>
    </CustomModal>
  )
}
