import defaultAxios from '../axios'
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '../../types/address'
import type { ListParams, PaginatedResponse } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getAddresses = async (params?: ListParams): Promise<{ data: Address[]; total: number }> => {
  const res = await defaultAxios.get<PaginatedResponse<Address>>(apiUrls.addresses.list, { params })
  return { data: res.data?.items ?? [], total: res.data?.total ?? 0 }
}

export const getAddressById = async (id: string): Promise<Address> => {
  const res = await defaultAxios.get<Address>(apiUrls.addresses.detail(id))
  return res.data
}

export const getAddressesByCustomer = async (customerId: string): Promise<Address[]> => {
  const res = await defaultAxios.get<Address[]>(apiUrls.addresses.byCustomer(customerId))
  return res.data
}

export const createAddress = async (data: CreateAddressRequest): Promise<Address> => {
  const res = await defaultAxios.post<Address>(apiUrls.addresses.create, data)
  return res.data
}

export const updateAddress = async (id: string, data: UpdateAddressRequest): Promise<Address> => {
  const res = await defaultAxios.patch<Address>(apiUrls.addresses.update(id), data)
  return res.data
}

export const deleteAddress = async (id: string): Promise<void> => {
  await defaultAxios.delete(apiUrls.addresses.delete(id))
}
