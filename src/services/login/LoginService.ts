import defaultAxios from '../axios'
import type { LoginRequest, LoginResponse } from '../../types/login'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await defaultAxios.post<LoginResponse>(apiUrls.auth.login, data)
  return res.data
}
