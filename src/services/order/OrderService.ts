import defaultAxios from '../axios'
import type { Order, CreateOrderRequest, UpdateOrderRequest } from '../../types/order'
import type { ListParams, PaginatedResponse } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getOrders = async (params?: ListParams): Promise<{ data: Order[]; total: number }> => {
  const res = await defaultAxios.get<PaginatedResponse<Order>>(apiUrls.orders.list, { params })
  return { data: res.data?.data ?? [], total: res.data?.total ?? 0 }
}

export const getOrderById = async (id: string): Promise<Order> => {
  const res = await defaultAxios.get<Order>(apiUrls.orders.detail(id))
  return res.data
}

export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  const res = await defaultAxios.get<Order[]>(apiUrls.orders.byCustomer(customerId))
  return res.data
}

export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  const res = await defaultAxios.post<Order>(apiUrls.orders.create, data)
  return res.data
}

export const updateOrder = async (id: string, data: UpdateOrderRequest): Promise<Order> => {
  const res = await defaultAxios.patch<Order>(apiUrls.orders.update(id), data)
  return res.data
}

export const deleteOrder = async (id: string): Promise<void> => {
  await defaultAxios.delete(apiUrls.orders.delete(id))
}
