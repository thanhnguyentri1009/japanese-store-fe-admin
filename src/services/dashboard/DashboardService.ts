import defaultAxios from '../axios'
import type { DashboardSummary } from '../../types/dashboard'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await defaultAxios.get<DashboardSummary>(apiUrls.dashboard.summary)
  return res.data
}
