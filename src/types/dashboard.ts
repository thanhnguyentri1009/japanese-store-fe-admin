export interface DashboardSummary {
  totalRevenue: number
  totalOrders: number
  totalProduct: number
  totalUser: number
}

export interface TopSellingProduct {
  productId: string
  productName: string
  image?: string
  totalQuantitySold: number
  totalRevenue: number
}

export interface TopSellingProductsParams {
  month?: number
  year?: number
  limit?: number
}
