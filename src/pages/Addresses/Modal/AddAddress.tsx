import { Form, Select, Switch } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import { createAddress } from '../../../services/address/AddressService'
import { getCustomers } from '../../../services/customer/CustomerService'

interface AddAddressProps {
  open: boolean
  onClose: () => void
}

export default function AddAddress({ open, onClose }: AddAddressProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      toast.success('Address created')
      form.resetFields()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
    onError: () => {
      toast.error('Failed to create address')
    },
  })

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <CustomModal
      title="Add Address"
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isPending}
    >
      <Form form={form} layout="vertical" onFinish={(values) => mutate(values)} style={{ marginTop: 16 }}>
        <Form.Item name="customerId" label="Customer" rules={[{ required: true, message: 'Please select customer' }]}>
          <Select
            showSearch
            placeholder="Select customer"
            filterOption={(input, opt) =>
              String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={customersData?.data.map((c) => ({ value: c.id, label: `${c.name} — ${c.email}` })) ?? []}
          />
        </Form.Item>
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
        <Form.Item name="isDefault" label="Default Address" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
      </Form>
    </CustomModal>
  )
}
