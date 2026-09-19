export interface ListParams {
  page?: number
  perPage?: number
  search?: string
  [key: string]: unknown
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}
