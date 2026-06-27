import { useState } from 'react'
import { Table, Typography } from 'antd'
import type { TableProps } from 'antd'
import type { Role } from '../../types/role'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import SearchRoles from './components/SearchRoles'

const columns: TableProps<Role>['columns'] = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Name', dataIndex: 'name' },
]

export default function Roles() {
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Role>({
    queryKey: ['roles'],
    url: apiUrls.roles.list,
    params,
  })

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
    </>
  )
}
