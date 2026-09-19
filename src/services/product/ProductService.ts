import defaultAxios from '../axios'
import type { Product, CreateProductRequest, UpdateProductRequest } from '../../types/product'
import type { ListParams, PaginatedResponse } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getProducts = async (params?: ListParams): Promise<{ data: Product[]; total: number }> => {
  const res = await defaultAxios.get<PaginatedResponse<Product>>(apiUrls.products.list, { params })
  return { data: res.data?.items ?? [], total: res.data?.total ?? 0 }
}

export const getProductById = async (id: string): Promise<Product> => {
  const res = await defaultAxios.get<Product>(apiUrls.products.detail(id))
  return res.data
}

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const res = await defaultAxios.get<Product[]>(apiUrls.products.byCategory(categoryId))
  return res.data
}

export const getProductsByBrand = async (brandId: string): Promise<Product[]> => {
  const res = await defaultAxios.get<Product[]>(apiUrls.products.byBrand(brandId))
  return res.data
}

export const createProduct = async (data: CreateProductRequest): Promise<Product> => {
  const res = await defaultAxios.post<Product>(apiUrls.products.create, data)
  return res.data
}

export const updateProduct = async (id: string, data: UpdateProductRequest): Promise<Product> => {
  const res = await defaultAxios.patch<Product>(apiUrls.products.update(id), data)
  return res.data
}

export const deleteProduct = async (id: string): Promise<void> => {
  await defaultAxios.delete(apiUrls.products.delete(id))
}
