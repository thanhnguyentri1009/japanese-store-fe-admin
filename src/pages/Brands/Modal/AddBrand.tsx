import { Form } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal'
import CustomInput from '../../../commons/components/CustomInput'
import { createBrand } from '../../../services/brand/BrandService'

interface AddBrandProps {
  open: boolean
  onClose: () => void
}

export default function AddBrand({ open, onClose }: AddBrandProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      toast.success('Brand created')
      form.resetFields()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
    onError: () => {
      toast.error('Failed to create brand')
    },
  })

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <CustomModal
      title="Add Brand"
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isPending}
    >
      <Form form={form} layout="vertical" onFinish={(values) => mutate(values)} style={{ marginTop: 16 }}>
        <CustomInput
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }, { max: 100 }]}
          placeholder="e.g. Pilot"
        />
      </Form>
    </CustomModal>
  )
}
