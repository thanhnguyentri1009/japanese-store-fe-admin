import { useMemo, useState } from 'react'
import {
  Card,
  Col,
  Empty,
  Image,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Typography,
} from 'antd'
import {
  ShoppingCartOutlined,
  AppstoreOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import type { TableProps } from 'antd'
import type { TopSellingProduct } from '../../types/dashboard'
import { getDashboardSummary } from '../../services/dashboard/DashboardService'
import { getTopSellingProducts } from '../../services/statistic/StatisticService'
import { formatMoney } from '../../utils/formatMoney'

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Month ${i + 1}`,
}))

export default function Dashboard() {
  const now = useMemo(() => new Date(), [])
  const [month, setMonth] = useState(now.getMonth() + 1)
  const year = now.getFullYear()

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
    staleTime: 60 * 1000,
  })

  const { data: topProducts, isLoading: isTopProductsLoading } = useQuery({
    queryKey: ['top-selling-products', month, year],
    queryFn: () => getTopSellingProducts({ month, year, limit: 10 }),
    staleTime: 60 * 1000,
  })

  const stats = [
    {
      title: 'Total Revenue',
      value: summary?.totalRevenue ?? 0,
      currency: 'VND' as const,
      icon: <DollarOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Orders',
      value: summary?.totalOrders ?? 0,
      icon: <ShoppingCartOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Products',
      value: summary?.totalProduct ?? 0,
      icon: <AppstoreOutlined />,
      color: '#faad14',
    },
    { title: 'Users', value: summary?.totalUser ?? 0, icon: <TeamOutlined />, color: '#f5222d' },
  ]

  const maxQuantitySold = Math.max(1, ...(topProducts ?? []).map((p) => p.totalQuantitySold))

  const columns: TableProps<TopSellingProduct>['columns'] = [
    { title: '#', width: 48, render: (_, __, index) => index + 1 },
    {
      title: 'Image',
      dataIndex: 'image',
      width: 72,
      render: (src) =>
        src ? (
          <Image src={src} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          '-'
        ),
    },
    { title: 'Product', dataIndex: 'productName' },
    {
      title: 'Quantity Sold',
      dataIndex: 'totalQuantitySold',
      width: 220,
      render: (value: number) => (
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <span>{value}</span>
          <Progress
            percent={Math.round((value / maxQuantitySold) * 100)}
            showInfo={false}
            size="small"
          />
        </Space>
      ),
    },
    {
      title: 'Revenue',
      dataIndex: 'totalRevenue',
      render: (value: number) => formatMoney(value),
    },
  ]

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 24 }}>
        Dashboard
      </Typography.Title>
      <Row gutter={[16, 16]}>
        {stats.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card loading={isSummaryLoading}>
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

      <Card
        style={{ marginTop: 24 }}
        title="Top 10 Best-Selling Products This Month"
        extra={
          <Select
            size="small"
            value={month}
            onChange={setMonth}
            options={MONTH_OPTIONS}
            style={{ width: 130 }}
          />
        }
      >
        <Table
          tableLayout="fixed"
          columns={columns}
          dataSource={topProducts ?? []}
          rowKey="productId"
          loading={isTopProductsLoading}
          pagination={false}
          locale={{ emptyText: <Empty description="No sales recorded for this month" /> }}
        />
      </Card>
    </>
  )
}
