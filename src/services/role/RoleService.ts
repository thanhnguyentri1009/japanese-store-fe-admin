import defaultAxios from '../axios'
import type { Role } from '../../types/role'
import type { ListParams } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

type ListResponse = Role[] | { data: Role[]; total?: number }

export const getRoles = async (params?: ListParams): Promise<{ data: Role[]; total: number }> => {
  const res = await defaultAxios.get<ListResponse>(apiUrls.roles.list, { params })
  if (Array.isArray(res.data)) return { data: res.data, total: res.data.length }
  return { data: res.data?.data ?? [], total: res.data?.total ?? 0 }
}

export const getRoleById = async (id: string): Promise<Role> => {
  const res = await defaultAxios.get<Role>(apiUrls.roles.detail(id))
  return res.data
}
