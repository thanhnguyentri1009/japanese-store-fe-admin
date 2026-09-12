import { useState } from 'react'
import { Button, Table, Typography } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { Role } from '../../types/role'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import SearchRoles from './components/SearchRoles'
import RoleDetailModal from './Modal/RoleDetailModal'

export default function Roles() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Role>({
    queryKey: ['roles'],
    url: apiUrls.roles.list,
    params,
  })

  const columns: TableProps<Role>['columns'] = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => setSelectedRole(record)} />
      ),
    },
  ]

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>Roles</Typography.Title>
      <SearchRoles onSearch={(search) => setParams({ search })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <RoleDetailModal
        open={!!selectedRole}
        role={selectedRole}
        onClose={() => setSelectedRole(null)}
      />
    </>
  )
}
