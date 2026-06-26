import { Button, Card, Form, Input, Typography } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/login/LoginService'
import type { JwtPayload, LoginRequest } from '../../types/login'
import { TOKEN_KEY } from '../../commons/constants'
import { LOCAL_STORAGE_KEYS, localStorageService } from '../../utils/localStorage'

const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

const getRoleName = (role: JwtPayload['role']): string => {
  if (typeof role === 'string') return role
  return role?.name ?? ''
}

export default function Login() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const setPasswordError = (msg: string) => {
    form.setFields([{ name: 'password', errors: [msg] }])
  }

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const payload = decodeJwt(data.access_token)

      if (!payload || getRoleName(payload.role).toLowerCase() !== 'admin') {
        setPasswordError('You do not have permission to access this page.')
        return
      }

      localStorageService.setItem(TOKEN_KEY, data.access_token)
      localStorageService.setItem(LOCAL_STORAGE_KEYS.user, JSON.stringify(payload))
      navigate('/dashboard')
    },
    onError: () => {
      setPasswordError('Invalid username or password.')
    },
  })

  const onFinish = (values: LoginRequest) => {
    mutate(values)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 380 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          JP Store Admin
        </Typography.Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={isPending}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
