import { Form, Select, Switch } from 'antd'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { createProduct } from '../../../services/product/ProductService'
import { uploadImageToServer } from '../../../services/upload/UploadService'
import { getCategories } from '../../../services/category/CategoryService'
import { getBrands } from '../../../services/brand/BrandService'
import type { CreateProductRequest } from '../../../types/product'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomUploadImage from '../../../commons/components/CustomUploadImage/CustomUploadImage'

type AddProductFormValues = Omit<CreateProductRequest, 'image'> & { image: File | string }

interface AddProductProps {
  open: boolean
  onClose: () => void
}

export default function AddProduct({ open, onClose }: AddProductProps) {
  const [form] = Form.useForm()
  const [imagePreview, setImagePreview] = useState<string | undefined>()
  const queryClient = useQueryClient()

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands(),
  })

  const handleImageChange = (file: File) => {
    form.setFieldValue('image', file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageRemove = () => {
    form.setFieldValue('image', undefined)
    setImagePreview(undefined)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: AddProductFormValues) => {
      const imageUrl =
        typeof values.image === 'string' ? values.image : await uploadImageToServer(values.image)
      return createProduct({ ...values, image: imageUrl })
    },
    onSuccess: () => {
      toast.success('Product created')
      form.resetFields()
      setImagePreview(undefined)
      onClose()
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error('Failed to create product')
    },
  })

  const handleCancel = () => {
    form.resetFields()
    setImagePreview(undefined)
    onClose()
  }

  return (
    <CustomModal
      title="Add Product"
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={isPending}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => mutate(values)}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="image"
          rules={[{ required: true, message: 'Please upload an image' }]}
          getValueProps={() => ({})}
        >
          <CustomUploadImage
            editing
            size={100}
            label="Image"
            src={imagePreview}
            onChange={handleImageChange}
            onRemove={imagePreview ? handleImageRemove : undefined}
          />
        </Form.Item>
        <CustomInput
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter name' }]}
          placeholder="Product name"
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item name="categoryId" label="Category">
            <Select
              placeholder="Select category"
              allowClear
              options={categoriesData?.data.map((c) => ({ value: c.id, label: c.name })) ?? []}
            />
          </Form.Item>
          <Form.Item name="brandId" label="Brand">
            <Select
              placeholder="Select brand"
              allowClear
              options={brandsData?.data.map((b) => ({ value: b.id, label: b.name })) ?? []}
            />
          </Form.Item>
          <CustomInput
            name="price"
            label="Price"
            type="number"
            rules={[{ required: true, message: 'Please enter price' }]}
            min={0}
            placeholder="0"
          />
          <CustomInput name="stock" label="Stock" type="number" min={0} placeholder="0" />
          <CustomInput name="series" label="Series" placeholder="e.g. Pilot Kakuno" />
          <CustomInput
            name="size"
            label="Size"
            type="number"
            min={0}
            placeholder="e.g. 70"
          />
          <CustomInput name="nibType" label="Nib Type" placeholder="e.g. Fine, Medium" />
          <CustomInput name="inkType" label="Ink Type" placeholder="e.g. Cartridge, Converter" />
        </div>
        <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Form>
    </CustomModal>
  )
}
