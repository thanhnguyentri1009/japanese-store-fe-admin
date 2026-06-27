import defaultAxios from '../axios'
import type { Brand, CreateBrandRequest, UpdateBrandRequest } from '../../types/brand'
import type { ListParams } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

type ListResponse = Brand[] | { data: Brand[]; total?: number }

export const getBrands = async (params?: ListParams): Promise<{ data: Brand[]; total: number }> => {
  const res = await defaultAxios.get<ListResponse>(apiUrls.brands.list, { params })
  if (Array.isArray(res.data)) return { data: res.data, total: res.data.length }
  return { data: res.data?.data ?? [], total: res.data?.total ?? 0 }
}

export const getBrandById = async (id: string): Promise<Brand> => {
  const res = await defaultAxios.get<Brand>(apiUrls.brands.detail(id))
  return res.data
}

export const createBrand = async (data: CreateBrandRequest): Promise<Brand> => {
  const res = await defaultAxios.post<Brand>(apiUrls.brands.create, data)
  return res.data
}

export const updateBrand = async (id: string, data: UpdateBrandRequest): Promise<Brand> => {
  const res = await defaultAxios.patch<Brand>(apiUrls.brands.update(id), data)
  return res.data
}

export const deleteBrand = async (id: string): Promise<void> => {
  await defaultAxios.delete(apiUrls.brands.delete(id))
}
