import defaultAxios from '../axios'
import type { Brand, CreateBrandRequest, UpdateBrandRequest } from '../../types/brand'
import type { ListParams, PaginatedResponse } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getBrands = async (params?: ListParams): Promise<{ data: Brand[]; total: number }> => {
  const res = await defaultAxios.get<PaginatedResponse<Brand>>(apiUrls.brands.list, { params })
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
