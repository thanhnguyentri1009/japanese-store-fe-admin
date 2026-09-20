import { Form, Input, InputNumber } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { FormItemProps, InputProps } from 'antd'
import type { CSSProperties, ReactNode } from 'react'

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
  size?: InputProps['size']
  prefix?: ReactNode
  // Standalone mode (no `name`, e.g. table filters outside a Form): controlled via value/onChange.
  value?: string | number | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNumberChange?: (value: number | null) => void
  style?: CSSProperties
}

export default function CustomInput({
  name,
  label,
  rules,
  type = 'text',
  placeholder,
  rows,
  min,
  max,
  disabled,
  size,
  prefix,
  value,
  onChange,
  onNumberChange,
  style,
}: CustomInputProps) {
  const isStandalone = !name

  const renderInput = () => {
    switch (type) {
      case 'password':
        return (
          <Input.Password
            prefix={prefix}
            placeholder={placeholder}
            disabled={disabled}
            size={size}
            style={style}
          />
        )
      case 'number':
        return (
          <InputNumber
            style={{ width: '100%', ...style }}
            placeholder={placeholder}
            min={min}
            max={max}
            disabled={disabled}
            controls={false}
            size={size}
            {...(isStandalone
              ? {
                  value: value as number | null | undefined,
                  onChange: onNumberChange,
                }
              : {})}
          />
        )
      case 'textarea':
        return <Input.TextArea rows={rows} placeholder={placeholder} disabled={disabled} style={style} />
      case 'search':
        return (
          <Input
            prefix={prefix ?? <SearchOutlined />}
            placeholder={placeholder}
            onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            allowClear
            style={style}
            disabled={disabled}
            size={size}
          />
        )
      default:
        return <Input prefix={prefix} placeholder={placeholder} disabled={disabled} size={size} style={style} />
    }
  }

  if (type === 'search' || isStandalone) return renderInput()

  return (
    <Form.Item name={name} label={label} rules={rules}>
      {renderInput()}
    </Form.Item>
  )
}
