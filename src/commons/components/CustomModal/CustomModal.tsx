import { Modal } from 'antd'
import type { ModalProps } from 'antd'

export default function CustomModal({ children, ...props }: ModalProps) {
  return <Modal {...props}>{children}</Modal>
}
