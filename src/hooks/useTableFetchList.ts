import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import defaultAxios from '../services/axios'
import { useCustomSearchParams } from './useCustomSearchParams'
import { usePagination } from './usePagination'

interface UseTableFetchListParams<T>
  extends Omit<UseQueryOptions<{ items: T[]; total: number }>, 'queryKey' | 'queryFn'> {
  queryKey: string[]
  url: string
  params?: Record<string, unknown>
  returnFieldKey?: string
  enabled?: boolean
  minuteStaleTime?: number
  dataHandler?: (data: { items: T[]; total: number }) => { items: T[]; total: number }
  retry?: number
  syncUrlQuery?: boolean
}

const cleanParams = (obj?: Record<string, unknown>) => {
  if (!obj) return {}
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  )
}

const isPrimitive = (value: unknown) => ['string', 'number', 'boolean'].includes(typeof value)

const normalizeBooleanValue = (value: unknown) => {
  if (value === 'true') return true
  if (value === 'false') return false
  return value
}

function useTableFetchList<T = unknown>({
  url,
  params,
  returnFieldKey = 'data',
  enabled = true,
  minuteStaleTime = 1,
  queryKey,
  dataHandler,
  retry = 2,
  syncUrlQuery = false,
  ...props
}: UseTableFetchListParams<T>) {
  const [filterParams, setFilterParams] = useState<Record<string, unknown> | undefined>(params)
  const { searchParams, getParamsAsObject, setAll } = useCustomSearchParams()
  const { pagination, setTotalRows, setCurrentPage, setPageSize } = usePagination()
  const { current: currentPage, pageSize, total } = pagination
  const hasHydratedFromUrlRef = useRef(false)
  const hasSyncedParamsRef = useRef(false)
  const managedQueryKeysRef = useRef<Set<string>>(new Set(['page', 'perPage']))

  useEffect(() => {
    // Sync URL query params → state on first mount only
    if (!syncUrlQuery || hasHydratedFromUrlRef.current) return
    const parsedQuery = getParamsAsObject()
    const pageFromUrl = Number(parsedQuery.page)
    const perPageFromUrl = Number(parsedQuery.perPage)
    const { page: _page, perPage: _perPage, ...urlFilters } = parsedQuery

    if (Object.keys(urlFilters).length > 0) {
      const normalized = Object.fromEntries(
        Object.entries(urlFilters).map(([k, v]) => [k, normalizeBooleanValue(v)]),
      )
      setFilterParams((prev) => ({ ...(prev ?? {}), ...normalized }))
    }

    if (Number.isInteger(pageFromUrl) && pageFromUrl > 0) setCurrentPage(pageFromUrl)
    if (Number.isInteger(perPageFromUrl) && perPageFromUrl > 0) setPageSize(perPageFromUrl)

    managedQueryKeysRef.current = new Set([...managedQueryKeysRef.current, ...Object.keys(urlFilters)])
    hasHydratedFromUrlRef.current = true
  }, [searchParams, setCurrentPage, setPageSize, syncUrlQuery, getParamsAsObject])

  useEffect(() => {
    // Skip first run — already hydrated from URL in the effect above
    if (!hasSyncedParamsRef.current) {
      hasSyncedParamsRef.current = true
      return
    }
    const oldStr = JSON.stringify(cleanParams(filterParams))
    const newStr = JSON.stringify(cleanParams(params))
    if (newStr !== oldStr) {
      setCurrentPage(1)
      setFilterParams(params)
    }
  }, [params, setCurrentPage])

  useEffect(() => {
    // Write state → URL query params
    if (!syncUrlQuery) return
    const cleanedFilterParams = cleanParams(filterParams)
    const managedKeys = new Set([...Object.keys(cleanedFilterParams), 'page', 'perPage'])
    const nextSearchParams = new URLSearchParams(searchParams)

    managedQueryKeysRef.current.forEach((key) => nextSearchParams.delete(key))

    Object.entries(cleanedFilterParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => { if (isPrimitive(item)) nextSearchParams.append(key, String(item)) })
        return
      }
      if (isPrimitive(value)) nextSearchParams.set(key, String(value))
    })

    nextSearchParams.set('page', String(currentPage))
    nextSearchParams.set('perPage', String(pageSize))

    managedQueryKeysRef.current = managedKeys
    if (nextSearchParams.toString() !== searchParams.toString()) {
      setAll(nextSearchParams, { replace: true })
    }
  }, [currentPage, filterParams, pageSize, searchParams, setAll, syncUrlQuery])

  const fetchData = async (): Promise<{ items: T[]; total: number }> => {
    const { data } = await defaultAxios.get(url, {
      params: { ...cleanParams(filterParams), page: currentPage, perPage: pageSize },
    })
    const meta = data[returnFieldKey] ?? data.data ?? data
    const items: T[] = meta[returnFieldKey] ?? meta ?? []
    const total: number = meta.total ?? items.length ?? 0
    return { items, total }
  }

  const { data: tableData, isLoading, refetch } = useQuery<{ items: T[]; total: number }>({
    queryKey: [...queryKey, url, JSON.stringify(filterParams), currentPage, pageSize],
    queryFn: fetchData,
    enabled,
    staleTime: minuteStaleTime * 60 * 1000,
    select: dataHandler,
    retry,
    ...props,
  })

  useEffect(() => {
    if (tableData) setTotalRows(tableData.total)
  }, [tableData, setTotalRows])

  return {
    tableData: tableData?.items,
    isLoading,
    currentPage,
    pageSize,
    total,
    pagination,
    refetch,
    setTotalRows,
    setCurrentPage,
  }
}

export default useTableFetchList
