import { Form, Select } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import { createOrder } from '../../../services/order/OrderService'
import { getCustomers } from '../../../services/customer/CustomerService'
import { getAddresses } from '../../../services/address/AddressService'
import type { OrderStatus } from '../../../types/order'

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'gold' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  shipping: { label: 'Shipping', color: 'cyan' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
}

const statusOptions = (Object.keys(statusConfig) as OrderStatus[]).map((k) => ({
  value: k,
  label: statusConfig[k].label,
}))

interface AddOrderProps {
  open: boolean
  onClose: () => void
}

export default function AddOrder({ open, onClose }: AddOrderProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(),
  })

  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses(),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success('Order created')
      form.resetFields()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      toast.error('Failed to create order')
    },
  })

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <CustomModal
      title="Add Order"
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
        <Form.Item name="addressId" label="Address">
          <Select
            showSearch
            placeholder="Select address"
            allowClear
            filterOption={(input, opt) =>
              String(opt?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={addressesData?.data.map((a) => ({ value: a.id, label: `${a.address}, ${a.country}` })) ?? []}
          />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select placeholder="Select status" allowClear options={statusOptions} />
        </Form.Item>
        <CustomInput name="totalAmount" label="Total Amount" type="number" min={0} placeholder="0" />
      </Form>
    </CustomModal>
  )
}
