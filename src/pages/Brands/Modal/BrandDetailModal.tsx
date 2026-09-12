import { useEffect } from 'react'
import { Descriptions, Form } from 'antd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import { updateBrand } from '../../../services/brand/BrandService'
import type { Brand, UpdateBrandRequest } from '../../../types/brand'

interface BrandDetailModalProps {
  open: boolean
  brand: Brand | null
  onClose: () => void
}

export default function BrandDetailModal({ open, brand, onClose }: BrandDetailModalProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (brand) form.setFieldsValue(brand)
  }, [brand, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (values: UpdateBrandRequest) => updateBrand(brand!.id, values),
    onSuccess: () => {
      toast.success('Brand updated')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
    onError: () => {
      toast.error('Failed to update brand')
    },
  })

  if (!brand) return null

  return (
    <CustomModal
      title="Brand Detail"
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isPending}
    >
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="ID">{brand.id}</Descriptions.Item>
      </Descriptions>

      <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
        <CustomInput
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
          placeholder="e.g. Pilot"
        />
      </Form>
    </CustomModal>
  )
}
