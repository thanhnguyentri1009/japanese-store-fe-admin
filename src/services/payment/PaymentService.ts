import defaultAxios from '../axios'
import type { Payment, CreatePaymentRequest, UpdatePaymentRequest } from '../../types/payment'
import type { ListParams } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

type ListResponse = Payment[] | { data: Payment[]; total?: number }

export const getPayments = async (params?: ListParams): Promise<{ data: Payment[]; total: number }> => {
  const res = await defaultAxios.get<ListResponse>(apiUrls.payments.list, { params })
  if (Array.isArray(res.data)) return { data: res.data, total: res.data.length }
  return { data: res.data?.data ?? [], total: res.data?.total ?? 0 }
}

export const getPaymentById = async (id: string): Promise<Payment> => {
  const res = await defaultAxios.get<Payment>(apiUrls.payments.detail(id))
  return res.data
}

export const getPaymentsByOrder = async (orderId: string): Promise<Payment[]> => {
  const res = await defaultAxios.get<Payment[]>(apiUrls.payments.byOrder(orderId))
  return res.data
}

export const createPayment = async (data: CreatePaymentRequest): Promise<Payment> => {
  const res = await defaultAxios.post<Payment>(apiUrls.payments.create, data)
  return res.data
}

export const updatePayment = async (id: string, data: UpdatePaymentRequest): Promise<Payment> => {
  const res = await defaultAxios.patch<Payment>(apiUrls.payments.update(id), data)
  return res.data
}

export const deletePayment = async (id: string): Promise<void> => {
  await defaultAxios.delete(apiUrls.payments.delete(id))
}
