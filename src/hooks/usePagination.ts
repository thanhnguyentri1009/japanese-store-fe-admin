import { useCallback, useMemo, useState } from 'react'
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../commons/constants'
import { useCustomSearchParams } from './useCustomSearchParams'

type Filter = { page: number; perPage: number } & Record<string, unknown>

export function usePagination(defaultPageSize: number = PAGE_SIZE) {
  const { get } = useCustomSearchParams()

  const [filters, setFiltersState] = useState<Filter>({
    page: (Number(get('page')) > 0 && Number(get('page'))) || 1,
    perPage: (Number(get('perPage')) > 0 && Number(get('perPage'))) || defaultPageSize,
  })
  const [totalRows, setTotalRows] = useState<number>(0)

  const setCurrentPage = useCallback((page: number) => {
    setFiltersState((prev) => ({ ...prev, page }))
  }, [])

  const handleShowSizeChange = useCallback((current: number, newPageSize: number) => {
    setFiltersState((prev) => ({ ...prev, page: current, perPage: newPageSize }))
  }, [])

  const setPageSize = useCallback((perPage: number) => {
    setFiltersState((prev) => ({ ...prev, perPage }))
  }, [])

  const setFilters = useCallback((values: Record<string, unknown>) => {
    setFiltersState((prev) => ({ ...prev, ...values, page: 1 }))
  }, [])

  const pagination = useMemo(
    () => ({
      pageSize: filters.perPage,
      current: filters.page,
      total: totalRows,
      onChange: setCurrentPage,
      onShowSizeChange: handleShowSizeChange,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      showSizeChanger: true,
    }),
    [filters.perPage, filters.page, totalRows, setCurrentPage, handleShowSizeChange]
  )

  return {
    pagination,
    setCurrentPage,
    setPageSize,
    setTotalRows,
    filters,
    setFilters,
  }
}
