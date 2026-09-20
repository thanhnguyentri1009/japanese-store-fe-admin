export interface ListParams {
  page?: number
  perPage?: number
  search?: string
  searchText?: string
  [key: string]: unknown
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}
