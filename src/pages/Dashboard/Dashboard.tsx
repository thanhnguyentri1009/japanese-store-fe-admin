import { Card, Col, Row, Statistic, Typography } from 'antd'
import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { formatMoney } from '../../utils/formatMoney'

const stats = [
  { title: 'Total Revenue', value: 125000000, currency: 'VND' as const, icon: <DollarOutlined />, color: '#1890ff' },
  { title: 'Orders', value: 1280, icon: <ShoppingCartOutlined />, color: '#52c41a' },
  { title: 'Products', value: 340, icon: <AppstoreOutlined />, color: '#faad14' },
  { title: 'Users', value: 5200, icon: <TeamOutlined />, color: '#f5222d' },
]

export default function Dashboard() {
  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 24 }}>
        Dashboard
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {stats.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card>
              <Statistic
                title={s.title}
                value={s.value}
                prefix={s.icon}
                valueStyle={{ color: s.color }}
                formatter={s.currency ? (v) => formatMoney(Number(v), s.currency) : undefined}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}
