import { useEffect } from 'react'
import { Descriptions, Form, Tag } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import { updateAccount } from '../../../services/account/AccountService'
import type { Account, UpdateAccountRequest } from '../../../types/account'

interface AccountDetailModalProps {
  open: boolean
  account: Account | null
  onClose: () => void
}

export default function AccountDetailModal({ open, account, onClose }: AccountDetailModalProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (account) form.setFieldsValue({ username: account.username, email: account.email })
  }, [account, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (values: UpdateAccountRequest) => updateAccount(account!.id, values),
    onSuccess: () => {
      toast.success('Account updated')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: () => {
      toast.error('Failed to update account')
    },
  })

  if (!account) return null

  return (
    <CustomModal
      title="Account Detail"
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isPending}
    >
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="ID">{account.id}</Descriptions.Item>
        <Descriptions.Item label="Role">
          {account.role ? <Tag color="purple">{account.role.name}</Tag> : '-'}
        </Descriptions.Item>
      </Descriptions>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => mutate({ ...values, password: values.password || undefined })}
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
          rules={[{ type: 'email', message: 'Invalid email' }]}
          placeholder="email@example.com"
        />
        <CustomInput
          name="password"
          label="New Password"
          type="password"
          rules={[{ min: 6, message: 'At least 6 characters' }]}
          placeholder="Leave blank to keep current password"
        />
      </Form>
    </CustomModal>
  )
}
