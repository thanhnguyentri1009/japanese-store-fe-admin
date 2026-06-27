import defaultAxios from '../axios'
import type { Profile } from '../../types/profile'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getMe = async (): Promise<Profile> => {
  const res = await defaultAxios.get<Profile>(apiUrls.profile.me)
  return res.data
}
