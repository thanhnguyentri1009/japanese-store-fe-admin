import { useState } from 'react'
import { Button, Table, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { Category } from '../../types/category'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import AddCategory from './Modal/AddCategory'
import SearchCategories from './components/SearchCategories'

const columns: TableProps<Category>['columns'] = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Name', dataIndex: 'name' },
]

export default function Categories() {
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Category>({
    queryKey: ['categories'],
    url: apiUrls.categories.list,
    params,
  })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Categories</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Category
        </Button>
      </div>

      <SearchCategories onSearch={(search) => setParams({ search })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddCategory open={open} onClose={() => setOpen(false)} />
    </>
  )
}
