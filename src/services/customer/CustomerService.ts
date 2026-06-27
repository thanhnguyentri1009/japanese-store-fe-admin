import defaultAxios from '../axios'
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../types/customer'
import type { ListParams } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

type ListResponse = Customer[] | { data: Customer[]; total?: number }

export const getCustomers = async (params?: ListParams): Promise<{ data: Customer[]; total: number }> => {
  const res = await defaultAxios.get<ListResponse>(apiUrls.customers.list, { params })
  if (Array.isArray(res.data)) return { data: res.data, total: res.data.length }
  return { data: res.data?.data ?? [], total: res.data?.total ?? 0 }
}

export const getCustomerById = async (id: string): Promise<Customer> => {
  const res = await defaultAxios.get<Customer>(apiUrls.customers.detail(id))
  return res.data
}

export const getCustomerByEmail = async (email: string): Promise<Customer> => {
  const res = await defaultAxios.get<Customer>(apiUrls.customers.byEmail(email))
  return res.data
}

export const createCustomer = async (data: CreateCustomerRequest): Promise<Customer> => {
  const res = await defaultAxios.post<Customer>(apiUrls.customers.create, data)
  return res.data
}

export const updateCustomer = async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
  const res = await defaultAxios.patch<Customer>(apiUrls.customers.update(id), data)
  return res.data
}

export const deleteCustomer = async (id: string): Promise<void> => {
  await defaultAxios.delete(apiUrls.customers.delete(id))
}
