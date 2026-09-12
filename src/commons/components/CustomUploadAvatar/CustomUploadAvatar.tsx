import { CameraOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons'
import { Avatar, Image, Upload } from 'antd'
import type { UploadChangeParam } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import { useState } from 'react'
import type { ReactNode } from 'react'
import './CustomUploadAvatar.scss'

interface CustomUploadAvatarProps {
  src?: string
  initials?: string
  editing?: boolean
  onChange?: (file: File) => void
  size?: number
  maxMb?: number
  sizeErrorText?: string
  label?: ReactNode
  onRemove?: () => void
}

const CustomUploadAvatar = ({
  src,
  initials = '?',
  editing = false,
  onChange,
  size = 80,
  maxMb = 2,
  sizeErrorText,
  label,
  onRemove,
}: CustomUploadAvatarProps) => {
  const [error, setError] = useState<string | null>(null)

  const avatarStyle = { backgroundColor: '#12233d', fontSize: size * 0.35, fontWeight: 600, borderRadius: '10%', border: 'none' }

  const handleChange = ({ file }: UploadChangeParam<UploadFile>) => {
    const raw = (file.originFileObj ?? file) as File
    if (raw.size > maxMb * 1024 * 1024) {
      setError(sizeErrorText ?? `Max file size is ${maxMb}MB`)
      return
    }
    setError(null)
    onChange?.(raw)
  }

  const labelEl = label ? <span className="custom-upload-avatar__label">{label}</span> : null

  if (editing) {
    return (
      <div className="custom-upload-avatar">
        {labelEl}
        <Upload showUploadList={false} beforeUpload={() => false} accept="image/*" onChange={handleChange}>
          <div className="custom-upload-avatar__trigger">
            <Avatar
              size={size}
              src={src}
              style={
                src
                  ? { ...avatarStyle, backgroundColor: 'transparent' }
                  : { ...avatarStyle, backgroundColor: '#fff', border: '1.5px solid #c8d6e5' }
              }
              icon={!src ? <UploadOutlined style={{ fontSize: size * 0.25, color: '#8c8c8c' }} /> : undefined}
            >
              {src ? initials : null}
            </Avatar>
            {onRemove ? (
              <div
                className="custom-upload-avatar__overlay custom-upload-avatar__overlay--remove"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
              >
                <CloseOutlined />
              </div>
            ) : (
              <div className="custom-upload-avatar__overlay">
                <CameraOutlined />
              </div>
            )}
          </div>
        </Upload>
        {error && <span className="custom-upload-avatar__error">{error}</span>}
      </div>
    )
  }

  if (src) {
    return (
      <div className="custom-upload-avatar">
        {labelEl}
        <div className="custom-upload-avatar__preview" style={{ width: size, height: size }}>
          <Image src={src} width={size} height={size} style={{ objectFit: 'cover' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="custom-upload-avatar">
      {labelEl}
      <Avatar size={size} style={avatarStyle}>
        {initials}
      </Avatar>
    </div>
  )
}

export default CustomUploadAvatar
