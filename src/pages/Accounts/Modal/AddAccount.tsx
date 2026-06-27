import { Form, Select } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CustomModal from '../../../commons/components/CustomModal'
import CustomInput from '../../../commons/components/CustomInput'
import { createAccount } from '../../../services/account/AccountService'
import { getRoles } from '../../../services/role/RoleService'
import { toast } from 'react-toastify'

interface AddAccountProps {
  open: boolean
  onClose: () => void
}

export default function AddAccount({ open, onClose }: AddAccountProps) {
  const [form] = Form.useForm()
const queryClient = useQueryClient()

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles(),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      toast.success('Account created')
      form.resetFields()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: () => {
      toast.error('Failed to create account')
    },
  })

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <CustomModal
      title="Add Account"
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isPending}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => mutate(values)}
        style={{ marginTop: 16 }}
      >
        <CustomInput
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please enter username' }]}
          placeholder="username"
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
        <CustomInput
          name="password"
          label="Password"
          type="password"
          rules={[
            { required: true, message: 'Please enter password' },
            { min: 6, message: 'At least 6 characters' },
          ]}
          placeholder="••••••"
        />
        <Form.Item name="roleId" label="Role">
          <Select
            placeholder="Select role"
            allowClear
            options={rolesData?.data.map((r) => ({ value: r.id, label: r.name })) ?? []}
          />
        </Form.Item>
      </Form>
    </CustomModal>
  )
}
