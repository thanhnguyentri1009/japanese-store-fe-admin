import { Descriptions, Modal } from 'antd'
import type { Role } from '../../../types/role'

interface RoleDetailModalProps {
  open: boolean
  role: Role | null
  onClose: () => void
}

export default function RoleDetailModal({ open, role, onClose }: RoleDetailModalProps) {
  if (!role) return null

  return (
    <Modal title="Role Detail" open={open} onCancel={onClose} footer={null}>
      <Descriptions column={1} size="small" style={{ marginTop: 16 }}>
        <Descriptions.Item label="ID">{role.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{role.name}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}
