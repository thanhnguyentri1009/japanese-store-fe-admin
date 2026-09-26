import defaultAxios from '../axios'
import type { TopSellingProduct, TopSellingProductsParams } from '../../types/dashboard'
import { apiUrls } from '../../commons/constants/apiIUrl'

export const getTopSellingProducts = async (
  params?: TopSellingProductsParams
): Promise<TopSellingProduct[]> => {
  const res = await defaultAxios.get<TopSellingProduct[]>(apiUrls.statistics.topSellingProducts, {
    params,
  })
  return res.data
}
