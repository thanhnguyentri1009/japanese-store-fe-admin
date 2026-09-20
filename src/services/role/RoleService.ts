import defaultAxios from '../axios'
import type { Role } from '../../types/role'
import type { ListParams, PaginatedResponse } from '../../types/common'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getRoles = async (params?: ListParams): Promise<{ data: Role[]; total: number }> => {
  const res = await defaultAxios.get<PaginatedResponse<Role>>(apiUrls.roles.list, { params })
  return { data: res.data?.data ?? [], total: res.data?.total ?? 0 }
}

export const getRoleById = async (id: string): Promise<Role> => {
  const res = await defaultAxios.get<Role>(apiUrls.roles.detail(id))
  return res.data
}
