import defaultAxios from '../axios'
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../types/category'
import type { ListParams, PaginatedResponse } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getCategories = async (params?: ListParams): Promise<{ data: Category[]; total: number }> => {
  const res = await defaultAxios.get<PaginatedResponse<Category>>(apiUrls.categories.list, { params })
  return { data: res.data?.data ?? [], total: res.data?.total ?? 0 }
}

export const getCategoryById = async (id: string): Promise<Category> => {
  const res = await defaultAxios.get<Category>(apiUrls.categories.detail(id))
  return res.data
}

export const createCategory = async (data: CreateCategoryRequest): Promise<Category> => {
  const res = await defaultAxios.post<Category>(apiUrls.categories.create, data)
  return res.data
}

export const updateCategory = async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
  const res = await defaultAxios.patch<Category>(apiUrls.categories.update(id), data)
  return res.data
}

export const deleteCategory = async (id: string): Promise<void> => {
  await defaultAxios.delete(apiUrls.categories.delete(id))
}
