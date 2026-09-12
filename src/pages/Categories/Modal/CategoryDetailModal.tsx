import { useEffect } from 'react'
import { Descriptions, Form } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import { updateCategory } from '../../../services/category/CategoryService'
import type { Category, UpdateCategoryRequest } from '../../../types/category'

interface CategoryDetailModalProps {
  open: boolean
  category: Category | null
  onClose: () => void
}

export default function CategoryDetailModal({ open, category, onClose }: CategoryDetailModalProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (category) form.setFieldsValue(category)
  }, [category, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (values: UpdateCategoryRequest) => updateCategory(category!.id, values),
    onSuccess: () => {
      toast.success('Category updated')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: () => {
      toast.error('Failed to update category')
    },
  })

  if (!category) return null

  return (
    <CustomModal
      title="Category Detail"
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isPending}
    >
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="ID">{category.id}</Descriptions.Item>
      </Descriptions>

      <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
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
