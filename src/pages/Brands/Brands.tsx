import { useState } from 'react'
import { Button, Table, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import type { Brand } from '../../types/brand'
import { apiUrls } from '../../commons/constants/apiIUrl'
import useTableFetchList from '../../hooks/useTableFetchList'
import AddBrand from './Modal/AddBrand'
import SearchBrands from './components/SearchBrands'

const columns: TableProps<Brand>['columns'] = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Name', dataIndex: 'name' },
]

export default function Brands() {
  const [open, setOpen] = useState(false)
  const [params, setParams] = useState({})

  const { tableData, isLoading, pagination } = useTableFetchList<Brand>({
    queryKey: ['brands'],
    url: apiUrls.brands.list,
    params,
  })

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Brands
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Brand
        </Button>
      </div>

      <SearchBrands onSearch={(search) => setParams({ search })} />
      <Table
        tableLayout="fixed"
        columns={columns}
        dataSource={tableData ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
      />

      <AddBrand open={open} onClose={() => setOpen(false)} />
    </>
  )
}
