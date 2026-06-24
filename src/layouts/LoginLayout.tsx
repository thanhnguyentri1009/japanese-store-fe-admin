import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function LoginLayout({ children }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {children}
    </div>
  )
}
