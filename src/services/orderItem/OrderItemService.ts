import defaultAxios from '../axios'
import type {
  OrderItem,
  CreateOrderItemRequest,
  CreateOrderItemBulkRequest,
  UpdateOrderItemRequest,
} from '../../types/orderItem'
import type { ListParams, PaginatedResponse } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getOrderItems = async (params?: ListParams): Promise<{ data: OrderItem[]; total: number }> => {
  const res = await defaultAxios.get<PaginatedResponse<OrderItem>>(apiUrls.orderItems.list, { params })
  return { data: res.data?.data ?? [], total: res.data?.total ?? 0 }
}

export const getOrderItemById = async (id: string): Promise<OrderItem> => {
  const res = await defaultAxios.get<OrderItem>(apiUrls.orderItems.detail(id))
  return res.data
}

export const getOrderItemsByOrder = async (orderId: string): Promise<OrderItem[]> => {
  const res = await defaultAxios.get<OrderItem[]>(apiUrls.orderItems.byOrder(orderId))
  return res.data
}

export const createOrderItem = async (data: CreateOrderItemRequest): Promise<OrderItem> => {
  const res = await defaultAxios.post<OrderItem>(apiUrls.orderItems.create, data)
  return res.data
}

export const createOrderItemsBulk = async (data: CreateOrderItemBulkRequest): Promise<OrderItem[]> => {
  const res = await defaultAxios.post<OrderItem[]>(apiUrls.orderItems.createBulk, data)
  return res.data
}

export const updateOrderItem = async (id: string, data: UpdateOrderItemRequest): Promise<OrderItem> => {
  const res = await defaultAxios.patch<OrderItem>(apiUrls.orderItems.update(id), data)
  return res.data
}

export const deleteOrderItem = async (id: string): Promise<void> => {
  await defaultAxios.delete(apiUrls.orderItems.delete(id))
}
