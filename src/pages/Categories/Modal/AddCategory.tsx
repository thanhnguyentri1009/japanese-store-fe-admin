import { Form } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal'
import CustomInput from '../../../commons/components/CustomInput'
import { createCategory } from '../../../services/category/CategoryService'

interface AddCategoryProps {
  open: boolean
  onClose: () => void
}

export default function AddCategory({ open, onClose }: AddCategoryProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category created')
      form.resetFields()
      onClose()
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: () => {
      toast.error('Failed to create category')
    },
  })

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <CustomModal
      title="Add Category"
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
          placeholder="e.g. Stationery"
        />
      </Form>
    </CustomModal>
  )
}
