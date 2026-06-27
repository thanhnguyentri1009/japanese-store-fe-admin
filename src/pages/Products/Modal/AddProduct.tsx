import { Form, Select, Switch, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { UploadFile } from 'antd'
import CustomModal from '../../../commons/components/CustomModal'
import CustomInput from '../../../commons/components/CustomInput'
import { uploadAxios } from '../../../services/axios'
import { apiUrls } from '../../../commons/constants/apiIUrl'
import { getCategories } from '../../../services/category/CategoryService'
import { getBrands } from '../../../services/brand/BrandService'
import type { Product } from '../../../types/product'

interface AddProductProps {
  open: boolean
  onClose: () => void
}

export default function AddProduct({ open, onClose }: AddProductProps) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const queryClient = useQueryClient()

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  })

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands(),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const formData = new FormData()
      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj as File)
      }
      Object.entries(values).forEach(([k, v]) => {
        if (v != null) formData.append(k, String(v))
      })
      const res = await uploadAxios.post<Product>(apiUrls.products.create, formData)
      return res.data
    },
    onSuccess: () => {
      toast.success('Product created')
      form.resetFields()
      setFileList([])
      onClose()
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error('Failed to create product')
    },
  })

  const handleCancel = () => {
    form.resetFields()
    setFileList([])
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
        <Form.Item label="Image">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
            accept="image/*"
            maxCount={1}
          >
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
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
        <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
      </Form>
    </CustomModal>
  )
}
