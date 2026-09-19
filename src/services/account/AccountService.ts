import defaultAxios from '../axios'
import type { Account, CreateAccountRequest, UpdateAccountRequest } from '../../types/account'
import type { ListParams, PaginatedResponse } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getAccounts = async (params?: ListParams): Promise<{ data: Account[]; total: number }> => {
  const res = await defaultAxios.get<PaginatedResponse<Account>>(apiUrls.accounts.list, { params })
  return { data: res.data?.items ?? [], total: res.data?.total ?? 0 }
}

export const getAccountById = async (id: string): Promise<Account> => {
  const res = await defaultAxios.get<Account>(apiUrls.accounts.detail(id))
  return res.data
}

export const createAccount = async (data: CreateAccountRequest): Promise<Account> => {
  const res = await defaultAxios.post<Account>(apiUrls.accounts.create, data)
  return res.data
}

export const updateAccount = async (id: string, data: UpdateAccountRequest): Promise<Account> => {
  const res = await defaultAxios.patch<Account>(apiUrls.accounts.update(id), data)
  return res.data
}

export const deleteAccount = async (id: string): Promise<void> => {
  await defaultAxios.delete(apiUrls.accounts.delete(id))
}
