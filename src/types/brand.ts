export interface Brand {
  id: string
  name: string
}

export interface CreateBrandRequest {
  name: string
}

export interface UpdateBrandRequest {
  name?: string
}
