import { useEffect } from 'react'
import { Descriptions, Form, Switch } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import { updateAddress } from '../../../services/address/AddressService'
import type { Address, UpdateAddressRequest } from '../../../types/address'

interface AddressDetailModalProps {
  open: boolean
  address: Address | null
  onClose: () => void
}

export default function AddressDetailModal({ open, address, onClose }: AddressDetailModalProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (address) form.setFieldsValue(address)
  }, [address, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (values: UpdateAddressRequest) => updateAddress(address!.id, values),
    onSuccess: () => {
      toast.success('Address updated')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
    onError: () => {
      toast.error('Failed to update address')
    },
  })

  if (!address) return null

  return (
    <CustomModal
      title="Address Detail"
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isPending}
    >
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="ID">{address.id}</Descriptions.Item>
        <Descriptions.Item label="Customer ID">{address.customerId ?? '-'}</Descriptions.Item>
      </Descriptions>

      <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
        <CustomInput
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter address' }]}
          placeholder="123 Street Name"
        />
        <CustomInput name="city" label="City" placeholder="Ho Chi Minh City" />
        <CustomInput
          name="country"
          label="Country"
          rules={[{ required: true, message: 'Please enter country' }]}
          placeholder="Vietnam"
        />
        <Form.Item name="isDefault" label="Default Address" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </CustomModal>
  )
}
