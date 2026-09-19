export interface ProductDetail {
  nibType?: string
  inkType?: string
  colorCount?: number
  stock: number
  isActive: boolean
  descriptions?: string[]
}

export interface Product {
  id: string
  name: string
  series?: string
  price: number
  categoryId?: string
  category?: { id: string; name: string }
  brandId?: string
  brand?: { id: string; name: string }
  detail?: ProductDetail
  image?: string
  createdAt: string
}

export interface CreateProductRequest {
  name: string
  categoryId?: string
  brandId?: string
  series?: string
  nibType?: string
  inkType?: string
  colorCount?: number
  price: number
  stock?: number
  isActive?: boolean
  image?: string
}

export interface UpdateProductRequest {
  name?: string
  categoryId?: string
  brandId?: string
  series?: string
  nibType?: string
  inkType?: string
  colorCount?: number
  price?: number
  stock?: number
  isActive?: boolean
  image?: string
}
