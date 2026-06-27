import { Form, Input, InputNumber } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { FormItemProps } from 'antd'
import type { CSSProperties } from 'react'

interface CustomInputProps {
  name?: FormItemProps['name']
  label?: string
  rules?: FormItemProps['rules']
  type?: 'text' | 'password' | 'number' | 'textarea' | 'search'
  placeholder?: string
  rows?: number
  min?: number
  max?: number
  disabled?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  style?: CSSProperties
}

export default function CustomInput({ name, label, rules, type = 'text', placeholder, rows, min, max, disabled, onChange, style }: CustomInputProps) {
  const renderInput = () => {
    switch (type) {
      case 'password':
        return <Input.Password placeholder={placeholder} disabled={disabled} />
      case 'number':
        return <InputNumber style={{ width: '100%' }} placeholder={placeholder} min={min} max={max} disabled={disabled} />
      case 'textarea':
        return <Input.TextArea rows={rows} placeholder={placeholder} disabled={disabled} />
      case 'search':
        return (
          <Input
            prefix={<SearchOutlined />}
            placeholder={placeholder}
            onChange={onChange}
            allowClear
            style={style}
            disabled={disabled}
          />
        )
      default:
        return <Input placeholder={placeholder} disabled={disabled} />
    }
  }

  if (type === 'search') return renderInput()

  return (
    <Form.Item name={name} label={label} rules={rules}>
      {renderInput()}
    </Form.Item>
  )
}
