import { useEffect, useState } from 'react'
import { Descriptions, Form, Select, Switch } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import CustomModal from '../../../commons/components/CustomModal/CustomModal'
import CustomInput from '../../../commons/components/CustomInput/CustomInput'
import CustomUploadAvatar from '../../../commons/components/CustomUploadAvatar/CustomUploadAvatar'
import { updateProduct } from '../../../services/product/ProductService'
import { uploadImageToServer } from '../../../services/upload/UploadService'
import { getCategories } from '../../../services/category/CategoryService'
import { getBrands } from '../../../services/brand/BrandService'
import type { Product, UpdateProductRequest } from '../../../types/product'

type ProductDetailFormValues = Omit<UpdateProductRequest, 'image'> & { image: File | string }

interface ProductDetailModalProps {
  open: boolean
  product: Product | null
  onClose: () => void
}

export default function ProductDetailModal({ open, product, onClose }: ProductDetailModalProps) {
  const [form] = Form.useForm()
  const [imagePreview, setImagePreview] = useState<string | undefined>()
  const queryClient = useQueryClient()

  const handleImageChange = (file: File) => {
    form.setFieldValue('image', file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageRemove = () => {
    form.setFieldValue('image', undefined)
    setImagePreview(undefined)
  }

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands(),
  })

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        categoryId: product.categoryId,
        brandId: product.brandId,
        price: product.price,
        stock: product.detail?.stock,
        series: product.series,
        nibType: product.detail?.nibType,
        inkType: product.detail?.inkType,
        isActive: product.detail?.isActive ?? true,
        image: product.image,
      })
      setImagePreview(product.image)
    }
  }, [product, form])

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ProductDetailFormValues) => {
      const imageUrl =
        typeof values.image === 'string' ? values.image : await uploadImageToServer(values.image)
      return updateProduct(product!.id, { ...values, image: imageUrl as string })
    },
    onSuccess: () => {
      toast.success('Product updated')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error('Failed to update product')
    },
  })

  if (!product) return null

  return (
    <CustomModal
      title="Product Detail"
      open={open}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isPending}
      width={600}
    >
      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="ID">{product.id}</Descriptions.Item>
        <Descriptions.Item label="Created">
          {new Date(product.createdAt).toLocaleString('vi-VN')}
        </Descriptions.Item>
      </Descriptions>

      <Form form={form} layout="vertical" onFinish={(values) => mutate(values)}>
        <Form.Item name="image" style={{ marginBottom: 16 }} getValueProps={() => ({})}>
          <CustomUploadAvatar
            editing
            size={100}
            label="Image"
            src={imagePreview}
            onChange={handleImageChange}
            onRemove={imagePreview ? handleImageRemove : undefined}
            maxMb={5}
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
            name="colorCount"
            label="Color Count"
            type="number"
            min={0}
            placeholder="0"
          />
          <CustomInput name="nibType" label="Nib Type" placeholder="e.g. Fine, Medium" />
          <CustomInput name="inkType" label="Ink Type" placeholder="e.g. Cartridge, Converter" />
        </div>
        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </CustomModal>
  )
}
